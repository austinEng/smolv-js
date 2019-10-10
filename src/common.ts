import {
    SpvOpDecorate,
    SpvOpSourceContinued,
    SpvOpSource,
    SpvOpSourceExtension,
    SpvOpName,
    SpvOpMemberName,
    SpvOpString,
    SpvOpLine,
    SpvOpNoLine,
    SpvOpModuleProcessed,
    SpvOpAccessChain,
    SpvOpVectorShuffle,
    SpvOpNop,
    SpvOpUndef,
    SpvOpLoad,
    SpvOpStore,
    SpvOpMemberDecorate,
    SpvOpLabel,
    SpvOpVariable,
    SpvOpMemoryModel,
    SpvOpTypePointer,
    SpvOpEntryPoint,
    SpvOpFNegate,
    SpvOpVectorShuffleCompact,
    SpvOpFMul,
    SpvOpExtension,
    SpvOpFAdd,
    SpvOpExtInstImport,
    KnownOpsCount
} from '../gen/spirvOps';

import { SpirvOpData, SpirvHeaderMagic } from '../gen/spirvOps';

export type DataCursor = {
    data: DataView,
    offset: number,
}

export const SmolvHeaderMagic = 0x534D4F4C; // "SMOL"

export function smolvOpHasResult(op: number): boolean {
    return op >= 0 && op < KnownOpsCount && SpirvOpData(op)[0] > 0;
}

export function smolvOpHasType(op: number): boolean {
    return op >= 0 && op < KnownOpsCount && SpirvOpData(op)[1] > 0;
}

export function smolvOpVarRest(op: number): boolean {
    return op >= 0 && op < KnownOpsCount && SpirvOpData(op)[2] > 0;
}

export function smolvOpDeltaFromResult(op: number): number {
    if (op < 0 || op > KnownOpsCount) {
        return 0;
    }
    return SpirvOpData(op)[3];
}

export function smolvOpDebugInfo(op: number): boolean {
    return (
        op === SpvOpSourceContinued ||
        op === SpvOpSource ||
        op === SpvOpSourceExtension ||
        op === SpvOpName ||
        op === SpvOpMemberName ||
        op === SpvOpString ||
        op === SpvOpLine ||
        op === SpvOpNoLine ||
        op === SpvOpModuleProcessed
    );
}

export function smolvDecorationExtraOps(dec: number) {
    if (dec == 0 || (dec >= 2 && dec <= 5)) // RelaxedPrecision, Block..ColMajor
        return 0;
    if (dec >= 29 && dec <= 37) // Stream..XfbStride
        return 1;
    return -1; // unknown, encode length
}

export function smolvCheckGenericHeader(input: DataCursor, expectedMagic: number): boolean {
    if (!input.data || input.data.byteLength < 20) return false;

    const bigEndianMagic = input.data.getUint32(input.offset, false);
    if (bigEndianMagic === expectedMagic) {
        throw new Error('Big endian encoding not supported');
        return false;
    }

    const magic = input.data.getUint32(input.offset, true);
    if (magic !== expectedMagic) return false;

    const version = input.data.getUint32(input.offset + 4, true);
    return true;
}

export function smolvCheckSpirvHeader(input: DataCursor): boolean {
    // TODO: if SPIR-V header magic was reversed, that means the file got written
    // in a "big endian" order. Need to byteswap all words then.
    return smolvCheckGenericHeader(input, SpirvHeaderMagic);
}

export function smolvCheckSmolvHeader(input: DataCursor): boolean {
    if (!smolvCheckGenericHeader(input, SmolvHeaderMagic)) return false;
    if (input.data.byteLength < 24) return false;
    return true;
}

function ensureOutputBufferFits(output: DataCursor, bytes: number) {
    if (output.offset + bytes > output.data.byteLength) {
        const minSize = output.data.byteLength + bytes;
        const candidateSize = output.data.byteLength * 1.5;
        const newSize = candidateSize > minSize ? candidateSize : minSize;
        const buffer = new ArrayBuffer(newSize);
        const src = new Uint8Array(output.data.buffer, output.data.byteOffset, output.data.byteLength);
        (new Uint8Array(buffer)).set(src);
        output.data = new DataView(buffer);
    }
}

export function smolvWrite4(output: DataCursor, value: number) {
    ensureOutputBufferFits(output, 4);
    output.data.setUint32(output.offset, value, true);
    output.offset += 4;
}

export function smolvRead4(input: DataCursor) {
    const value = input.data.getUint32(input.offset, true);
    input.offset += 4;
    return value;
}

export function smolvWrite1(output: DataCursor, value: number) {
    ensureOutputBufferFits(output, 1);
    output.data.setUint8(output.offset, value);
    output.offset += 1;
}

export function smolvRead1(input: DataCursor) {
    const value = input.data.getUint8(input.offset);
    input.offset += 1;
    return value;
}

// Variable-length integer encoding for unsigned integers. In each byte:
// - highest bit set if more bytes follow, cleared if this is last byte.
// - other 7 bits are the actual value payload.
// Takes 1-5 bytes to encode an integer (values between 0 and 127 take one byte, etc.).

export function smolvWriteVarint(output: DataCursor, value: number) {
    while (value > 127) {
        ensureOutputBufferFits(output, 1);
        output.data.setUint8(output.offset, (value & 127) | 128);
        output.offset++;
        value >>= 7;
    }
    ensureOutputBufferFits(output, 1);
    output.data.setUint8(output.offset, value & 127);
    output.offset++;
}

export function smolvReadVarint(input: DataCursor): number {
    let v = 0;
    let shift = 0;
    while (input.offset < input.data.byteLength) {
        const b = input.data.getUint8(input.offset);
        v |= (b & 127) << shift;
        shift += 7;
        input.offset++;
        if (!(b & 128)) {
            break;
        }
    }
    return v;
}

export function smolvZigEncode(i : number): number {
    return ((i >>> 0) << 1) ^ (i >> 31);
}

export function smolvZigDecode(i : number): number {
    return (i & 1) ? ((i >> 1) ^ ~0) : (i >> 1);
}

// Remap most common Op codes (Load, Store, Decorate, VectorShuffle etc.) to be in < 16 range, for
// more compact varint encoding. This basically swaps rarely used op values that are < 16 with the
// ones that are common.
export function smolvRemapOp(op: number) {
    // 0: 24%
    if (op === SpvOpDecorate) return SpvOpNop;
    if (op === SpvOpNop) return SpvOpDecorate;

    // 1: 17%
    if (op === SpvOpLoad) return SpvOpUndef;
    if (op === SpvOpUndef) return SpvOpLoad;

    // 2: 9%
    if (op === SpvOpStore) return SpvOpSourceContinued;
    if (op === SpvOpSourceContinued) return SpvOpStore;

    // 3: 7.2%
    if (op === SpvOpAccessChain) return SpvOpSource;
    if (op === SpvOpSource) return SpvOpAccessChain;

    // 4: 5.0%
    if (op === SpvOpVectorShuffle) return SpvOpSourceExtension;
    if (op === SpvOpSourceExtension) return SpvOpVectorShuffle;

    // Name - already small enum value - 5: 4.4%
    // MemberName - already small enum value - 6: 2.9%

    // 7: 4.0%
    if (op === SpvOpMemberDecorate) return SpvOpString;
    if (op === SpvOpString) return SpvOpMemberDecorate;

    // 8: 0.9%
    if (op === SpvOpLabel) return SpvOpLine;
    if (op === SpvOpLine) return SpvOpLabel;

    // 9: 3.9%
    if (op === SpvOpVariable) return 9;
    if (op === 9) return SpvOpVariable;

    // 10: 3.9%
    if (op === SpvOpFMul) return SpvOpExtension;
    if (op === SpvOpExtension) return SpvOpFMul;

    // 11: 2.5%
    if (op === SpvOpFAdd) return SpvOpExtInstImport;
    if (op === SpvOpExtInstImport) return SpvOpFAdd;

    // ExtInst - already small enum value - 12: 1.2%
    // VectorShuffleCompact - already small enum value - used for compact shuffle encoding

    // 14: 2.2%
    if (op === SpvOpTypePointer) return SpvOpMemoryModel;
    if (op === SpvOpMemoryModel) return SpvOpTypePointer;

    // 15: 1.1%
    if (op === SpvOpFNegate) return SpvOpEntryPoint;
    if (op === SpvOpEntryPoint) return SpvOpFNegate;

    return op;
}

// For most compact varint encoding of common instructions, the instruction length should come out
// into 3 bits (be <8). SPIR-V instruction lengths are always at least 1, and for some other
// instructions they are guaranteed to be some other minimum length. Adjust the length before encoding,
// and after decoding accordingly.

export function smolvEncodeLen(op: number, len: number) {
    len--;
    if (op === SpvOpVectorShuffle)          len -= 4;
    if (op === SpvOpVectorShuffleCompact)   len -= 4;
    if (op === SpvOpDecorate)               len -= 2;
    if (op === SpvOpLoad)                   len -= 3;
    if (op === SpvOpAccessChain)            len -= 3;
    return len;
}

export function smolvDecodeLen(op: number, len: number) {
    len++;
    if (op === SpvOpVectorShuffle)          len += 4;
    if (op === SpvOpVectorShuffleCompact)   len += 4;
    if (op === SpvOpDecorate)               len += 2;
    if (op === SpvOpLoad)                   len += 3;
    if (op === SpvOpAccessChain)            len += 3;
    return len;
}

export function smolvWriteLengthOp(output: DataCursor, len: number, op: number) {
    len = smolvEncodeLen(op, len);
    // SPIR-V length field is 16 bits; if we get a larger value that means something
    // was wrong, e.g. a vector shuffle instruction with less than 4 words (and our
    // adjustment to common lengths in smolv_EncodeLen wrapped around)
    if (len > 0xFFFF) {
        throw new Error('Invalid length field');
    }
    op = smolvRemapOp(op);
    const oplen = ((len >> 4) << 20) | ((op >> 4) << 8) | ((len & 0xF) << 4) | (op & 0xF);
    smolvWriteVarint(output, oplen);
}

type ReadLengthOpResult = { op: number, len: number };
const readLengthOpResult = { op: 0, len: 0 };
export function smolvReadLengthOp(input: DataCursor): ReadLengthOpResult {
    const val = smolvReadVarint(input);
    let outLen = ((val >> 20) << 4) | ((val >> 4) & 0xF);
    let outOp = (((val >> 4) & 0xFFF0) | (val & 0xF));

    outOp = smolvRemapOp(outOp);
    outLen = smolvDecodeLen(outOp, outLen);

    readLengthOpResult.op = outOp;
    readLengthOpResult.len = outLen;

    return readLengthOpResult;
}

type ReadOpResult = { op: number, len: number};
const readOpResult = { op: 0, len: 0};
export function smolvReadOp(input: DataCursor): ReadOpResult {
    const value = input.data.getUint32(input.offset, true);
    readOpResult.len = value >> 16;
    if (readOpResult.len < 1) {
        throw new Error('Invaid instruction: Length must be at least 1');
    }
    if (input.offset + readOpResult.len > input.data.byteLength) {
        throw new Error('Invalid instruction: Length exceeds buffer');
    }
    readOpResult.op = value & 0xFFFF;
    return readOpResult;
}
