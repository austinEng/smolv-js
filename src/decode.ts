import {
    DataCursor,
    smolvReadLengthOp,
    smolvWrite4,
    smolvRead4,
    smolvOpHasType,
    smolvReadVarint,
    smolvOpHasResult,
    smolvZigDecode,
    smolvOpDeltaFromResult,
    smolvRead1,
    smolvOpVarRest,
    smolvDecorationExtraOps,
    smolvCheckSmolvHeader
} from './common';

import {
    SpvOpMemberDecorate,
    SpvOpVectorShuffle,
    SpvOpVectorShuffleCompact,
    SpvOpDecorate,
    SpirvHeaderMagic,
 } from '../gen/spirvOps';

function makeDataCursor(data: ArrayBuffer, offsetArg?: number, lengthArg?: number): DataCursor {
    let byteLength = lengthArg;
    let byteOffset = offsetArg || 0;

    const input: DataCursor = {
        data: new DataView(data, byteOffset, byteLength),
        offset: 0
    };

    if (!smolvCheckSmolvHeader(input)) {
        throw new Error('Invalid SmolV header');
    }

    return input;
}

export function smolvDecodedSize(data: ArrayBuffer, offsetArg?: number, lengthArg?: number): number {
    const input = makeDataCursor(data, offsetArg, lengthArg);
    return input.data.getUint32(20, true);
}

export default function smolvDecode(data: ArrayBuffer, offsetArg?: number, lengthArg?: number): Uint8Array {
    const input = makeDataCursor(data, offsetArg, lengthArg);
    const decodedLength = input.data.getUint32(20, true);

    const output: DataCursor = {
        data: new DataView(new ArrayBuffer(decodedLength)),
        offset: 0,
    };

    smolvWrite4(output, SpirvHeaderMagic); input.offset += 4; // magic
    smolvWrite4(output, smolvRead4(input));  // version
    smolvWrite4(output, smolvRead4(input));  // generator
    smolvWrite4(output, smolvRead4(input));  // bound
    smolvWrite4(output, smolvRead4(input));  // schema
    input.offset += 4;

    let prevResult = 0;
    let prevDecorate = 0;

    while (input.offset < input.data.byteLength) {
        let {op, len: instrLen} = smolvReadLengthOp(input);

        const wasSwizzle = op === SpvOpVectorShuffleCompact;
        if (wasSwizzle) {
            op = SpvOpVectorShuffle;
        }
        smolvWrite4(output, (instrLen << 16) | op);

        let ioffs = 1;

        // read type as varint, if we have it
        if (smolvOpHasType(op)) {
            smolvWrite4(output, smolvReadVarint(input));
            ioffs++;
        }

        // read result as delta+varint, if we have it
        if (smolvOpHasResult(op)) {
            const value = prevResult + smolvZigDecode(smolvReadVarint(input));
            smolvWrite4(output, value);
            prevResult = value;
            ioffs++;
        }

        // Decorate: IDs relative to previous decorate
        if (op === SpvOpDecorate || op === SpvOpMemberDecorate) {
            const value = prevDecorate + smolvZigDecode(smolvReadVarint(input));
            smolvWrite4(output, value);
            prevDecorate = value;
            ioffs++;
        }

        // MemberDecorate special decoding
        if (op === SpvOpMemberDecorate) {
            const count = smolvRead1(input);
            let prevIndex = 0;
            let prevOffset = 0;
            for (let m = 0; m < count; ++m) {
                // read member index
                const memberIndex = prevIndex + smolvReadVarint(input);
                prevIndex = memberIndex;

                // decoration (and length if not common/known)
                const memberDec = smolvReadVarint(input);
                const knownExtraOps = smolvDecorationExtraOps(memberDec);
                let memberLen;
                if (knownExtraOps === -1) {
                    memberLen = 4 + smolvReadVarint(input);
                } else {
                    memberLen = 4 + knownExtraOps;
                }

                // write SPIR-V op+length (unless it's first member decoration, in which case it was written before)
                if (m !== 0) {
                    smolvWrite4(output, (memberLen << 16) | op);
                    smolvWrite4(output, prevDecorate);
                }
                smolvWrite4(output, memberIndex);
                smolvWrite4(output, memberDec);

                // Special case for Offset decorations
                if (memberDec === 35) {
                    if (memberLen !== 5) {
                        throw new Error('Invalid decoration length');
                    }
                    const value = prevOffset + smolvReadVarint(input);
                    smolvWrite4(output, value);
                    prevOffset = value;
                } else {
                    for (let i = 4; i < memberLen; ++i) {
                        smolvWrite4(output, smolvReadVarint(input));
                    }
                }
            }
            continue;
        }

        // Read this many IDs, that are relative to result ID
        const relativeCount = smolvOpDeltaFromResult(op);
        for (let i = 0; i < relativeCount && ioffs < instrLen; ++i, ++ioffs) {
            const value = smolvZigDecode(smolvReadVarint(input));
            smolvWrite4(output, prevResult - value);
        }

        if (wasSwizzle && instrLen <= 9) {
            const swizzle = smolvRead1(input);
            if (instrLen > 5) smolvWrite4(output, (swizzle >> 6) & 3);
            if (instrLen > 6) smolvWrite4(output, (swizzle >> 4) & 3);
            if (instrLen > 7) smolvWrite4(output, (swizzle >> 2) & 3);
            if (instrLen > 8) smolvWrite4(output, swizzle & 3);
        } else if (smolvOpVarRest(op)) {
            // read rest of words with variable encoding
            for (; ioffs < instrLen; ++ioffs) {
                smolvWrite4(output, smolvReadVarint(input));
            }
        } else {
            // read rest of words without any encoding
            for (; ioffs < instrLen; ++ioffs) {
                smolvWrite4(output, smolvRead4(input));
            }
        }
    }

    if (output.offset !== decodedLength) {
        throw new Error('Decode error: Did not fill destination buffer');
    }

    return new Uint8Array(output.data.buffer, output.data.byteOffset, output.offset);
}
