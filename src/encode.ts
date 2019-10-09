import { SpvOpVectorShuffle, SpvOpVectorShuffleCompact, SpvOpDecorate, SpvOpMemberDecorate } from '../gen/spirvOps';
import { smolvCheckSpirvHeader, DataCursor, smolvWrite4, SmolvHeaderMagic, smolvRead4, smolvReadOp, smolvOpDebugInfo, smolvWriteLengthOp, smolvOpHasType, smolvWriteVarint, smolvOpHasResult, smolvZigEncode, smolvOpDeltaFromResult, smolvWrite1, smolvOpVarRest, smolvDecorationExtraOps } from "./common";

export type EncodeOptions = {
    stripDebugInfo: boolean;
};

export default function smolvEncode(data: ArrayBuffer,
                                    offsetArg?: number,
                                    lengthArg?: number,
                                    options?: EncodeOptions): Uint8Array {
    let byteLength = lengthArg;
    let byteOffset = offsetArg || 0;
    options = {
        stripDebugInfo: options && options['stripDebugInfo']
    }

    const input: DataCursor = {
        data: new DataView(data, byteOffset, byteLength),
        offset: 0,
    };
    if (!smolvCheckSpirvHeader(input)) {
        throw new Error('Invalid SpirV header');
    }

    // reserve space in output (typical compression is to about 30%; reserve half of input space)
    let output: DataCursor = {
        data: new DataView(new ArrayBuffer(input.data.byteLength / 2)),
        offset: 0,
    };

    const magic = smolvRead4(input);
    const version = smolvRead4(input);
    const generator = smolvRead4(input);
    const bound = smolvRead4(input);
    const schema = smolvRead4(input);

    smolvWrite4(output, SmolvHeaderMagic);  // magic
    smolvWrite4(output, version); // version
    smolvWrite4(output, generator); // generator
    smolvWrite4(output, bound); // bound
    smolvWrite4(output, schema); // schema

    // size field may get updated later if stripping is enabled
    const headerSizeOffset = output.offset;
    // space needed to decode (i.e. original SPIR-V size)
    smolvWrite4(output, input.data.byteLength);

    let strippedSpirvWordCount = input.data.byteLength / 4;
    let prevResult = 0;
    let prevDecorate = 0;

    while (input.offset < input.data.byteLength) {
        let {op, len: instrLen} = smolvReadOp(input);

        if (options.stripDebugInfo && smolvOpDebugInfo(op)) {
            strippedSpirvWordCount -= instrLen;
            input.offset += 4 * instrLen;
            continue;
        }

        // A usual case of vector shuffle, with less than 4 components, each with a value
        // in [0..3] range: encode it in a more compact form, with the swizzle pattern in one byte
        // Turn this into a VectorShuffleCompact instruction, that takes up unused slot in Ops.
        let swizzle = 0;
        if (op === SpvOpVectorShuffle && instrLen <= 9) {
            const swz0 = instrLen > 5 ? input.data.getUint32(input.offset + 4 * 5, true) : 0;
            const swz1 = instrLen > 6 ? input.data.getUint32(input.offset + 4 * 6, true) : 0;
            const swz2 = instrLen > 7 ? input.data.getUint32(input.offset + 4 * 7, true) : 0;
            const swz3 = instrLen > 8 ? input.data.getUint32(input.offset + 4 * 8, true) : 0;
            if (swz0 < 4 && swz1 < 4 && swz2 < 4 && swz3 < 4) {
                op = SpvOpVectorShuffleCompact;
                swizzle = (swz0 << 6) | (swz1 << 4) | (swz2 << 2) | (swz3);
            }
        }

        // length + opcode
        smolvWriteLengthOp(output, instrLen, op);

        let ioffs = 1;

        // write type as varint, if we have it
        if (smolvOpHasType(op)) {
            if (ioffs >= instrLen) throw new Error('Too many operands');
            smolvWriteVarint(output, input.data.getUint32(input.offset + 4 * ioffs, true));
            ioffs++;
        }

        // write result as delta+zig+varint, if we have it
        if (smolvOpHasResult(op)) {
            if (ioffs >= instrLen) throw new Error('Too many operands');
            const value = input.data.getUint32(input.offset + 4 * ioffs, true);
            smolvWriteVarint(output, smolvZigEncode(value - prevResult));
            prevResult = value;
            ioffs++;
        }

        // Decorate & MemberDecorate: IDs relative to previous decorate
        if (op === SpvOpDecorate || op === SpvOpMemberDecorate) {
            if (ioffs >= instrLen) throw new Error('Too many operands');
            const value = input.data.getUint32(input.offset + 4 * ioffs, true);
            smolvWriteVarint(output, smolvZigEncode(value - prevDecorate));
            prevDecorate = value;
            ioffs++;
        }

        // MemberDecorate special encoding: whole row of MemberDecorate instructions is often referring
        // to the same type and linearly increasing member indices. Scan ahead to see how many we have,
        // and encode whole bunch as one.
        if (op === SpvOpMemberDecorate) {
            // scan ahead until we reach end, non-member-decoration or different type
            const decorationType = input.data.getUint32(input.offset + 4 * (ioffs - 1), true);

            const member: DataCursor = {
                data: input.data,
                offset: input.offset,
            };

            let prevIndex = 0;
            let prevOffset = 0;

            const countOffset = output.offset;
            smolvWrite1(output, 0);
            let count = 0;
            while (member.offset < input.data.byteLength && count < 255) {
                let { op: memberOp, len: memberLen } = smolvReadOp(member);

                if (memberOp !== SpvOpMemberDecorate) break;
                if (memberLen < 4) throw new Error('Invalid input');
                if (member.data.getUint32(member.offset + 4 * 1, true) !== decorationType) break;

                // write member index as delta from previous
                const memberIndex = member.data.getUint32(member.offset + 4 * 2, true);
                smolvWriteVarint(output, memberIndex - prevIndex);
                prevIndex = memberIndex;

                // decoration (and length if not common/known)
                const memberDec = member.data.getUint32(member.offset + 4 * 3, true);
                smolvWriteVarint(output, memberDec);
                const knownExtraOps = smolvDecorationExtraOps(memberDec);
                if (knownExtraOps === -1) {
                    smolvWriteVarint(output, memberLen - 4);
                } else if (knownExtraOps + 4 !== memberLen) {
                    throw new Error('Invalid input');
                }

                // Offset decorations are most often linearly increasing, so encode as deltas
                if (memberDec === 35) {
                    // Offset
                    if (memberLen !== 5) throw new Error('Invalid offset');
                    const offset = member.data.getUint32(member.offset + 4 * 4, true);
                    smolvWriteVarint(output, offset - prevOffset);
                    prevOffset = offset;
                } else {
                    // write rest of decorations as varint
                    for (let i = 4; i < memberLen; ++i) {
                        smolvWriteVarint(output, member.data.getUint32(member.offset + 4 * i, true));
                    }
                }

                member.offset += memberLen * 4;
                ++count;
            }

            output.data.setUint8(countOffset, count);
            input.offset = member.offset;
            continue;
        }

        // Write out this many IDs, encoding them relative+zigzag to result ID
        const relativeCount = smolvOpDeltaFromResult(op);
        for (let i = 0; i < relativeCount && ioffs < instrLen; ++i, ++ioffs) {
            if (ioffs >= instrLen) throw new Error('Too many operands');
            const delta = prevResult - input.data.getUint32(input.offset + 4 * ioffs, true);
            // some deltas are negative (often on branches, or if program was processed by spirv-remap),
            // so use zig encoding
            smolvWriteVarint(output, smolvZigEncode(delta));
        }

        if (op === SpvOpVectorShuffleCompact) {
            // compact vector shuffle, just write out single swizzle byte
            smolvWrite1(output, swizzle);
            ioffs = instrLen;
        } else if (smolvOpVarRest(op)) {
            // write out rest of words with variable encoding (expected to be small integers)
            for (; ioffs < instrLen; ++ioffs) {
                smolvWriteVarint(output, input.data.getUint32(input.offset + 4 * ioffs, true));
            }
        } else {
            // write out rest of words without any encoding
            for (; ioffs < instrLen; ++ioffs) {
                smolvWrite4(output, input.data.getUint32(input.offset + 4 * ioffs, true));
            }
        }

        input.offset += instrLen * 4;
    }

    if (strippedSpirvWordCount !== input.data.byteLength / 4) {
        output.data.setUint32(headerSizeOffset, strippedSpirvWordCount * 4);
    }

    return new Uint8Array(output.data.buffer, output.data.byteOffset, output.offset);
}
