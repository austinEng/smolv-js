
const coreJSON = require('spirv-headers/include/spirv/unified1/spirv.core.grammar.json');
const smolvJSON = require('../src/smolv.grammar.json');
const OpData = require('../src/opdata.js');

const instructions = [];
for (const ins of coreJSON.instructions) {
    instructions[ins.opcode] = ins;
}
for (const ins of smolvJSON.instructions) {
    instructions[ins.opcode] = ins;
}

for (let i = 0; i < instructions.length; ++i) {
    if (instructions[i] === undefined) {
        instructions[i] = undefined;
    }
}

function hasResult(ins) {
    return (ins.operands && ins.operands.find(o => o.kind === 'IdResult')) ? 1 : 0;
}

function hasType(ins) {
    return (ins.operands && ins.operands.find(o => o.kind === 'IdResultType')) ? 1 : 0;
}

const fs = require('fs');
fs.writeFileSync('./gen/spirvOps.ts', `

export const SpirvHeaderMagic = ${coreJSON.magic_number};
export const SpirvMajorVersion = ${coreJSON.major_version};
export const SpirvMinorVersion = ${coreJSON.minor_version};
export const SpirvRevision = ${coreJSON.revision};

${instructions.filter(ins => ins).map(ins => `export const Spv${ins.opname} = ${ins.opcode};`).join('\n')}

export const KnownOpsCount = ${instructions[instructions.length - 1].opcode + 1};

export const SpvOpNames = {
${instructions.filter(ins => ins).map(ins => {
    return `    ${ins.opcode}: "Spv${ins.opname}",`
}).join('\n')}
};

type OpData = [
    number,  // does it have result ID?
    number,  // does it have type ID?
    number,  // should the rest of words be written in varint encoding?
    number,  // How many words after (optional) type+result to write out as deltas from result?
];

const defaultData: OpData = [1, 1, 0, 0];

// We don't use a real enum because it bloats the minified js file.
type SpvOp = number;

// Data is packed into 1 or 2 numbers.
type CompressedOpData = number | number[];

// Consecutive SpvOps store data in an array so that we can omit sequential keys.
type PackedCompressedData = { [index:number]: CompressedOpData[] };

// The PackedCompressedData will be unpacked at runtime.
type UnpackedCompressedData = { [index:number]: CompressedOpData };

const SpirvOpDataCompressed: PackedCompressedData = {\n${(() => {
    let out = '';
    let prevOpcode = undefined;
    let startOpcode = undefined;
    let curr = [];
    function flush() {
        if (startOpcode !== undefined && curr.length > 0) {
            out += `    ${startOpcode}: [\n${curr.map(e => `    ${e}`).join(',\n')}\n    ],\n`;
        }
        curr = [];
    }

    instructions.filter(i => (i !== undefined)).forEach(ins => {
        const opData = OpData[ins.opcode];
        const data = [hasResult(ins), hasType(ins), opData ? opData[0] : 0, opData ? opData[1] : 0];
        const comment = `[${data.join(', ')}] ${ins.opname}`;

        // Strip defaults to save space. We'll infer them if undefined.
        const defaults = [1, 1, 0, 0];
        let i = data.length;
        for (; i >= 1; --i) if (data[i - 1] !== defaults[i - 1]) break;

        // Skip because it is exactly the default
        if (i === 0) {
            out += `    /* ${comment} */\n`;
            return;
        }

        if (ins.opcode !== prevOpcode + 1 && prevOpcode !== undefined) {
            flush();
            startOpcode = undefined;
        }

        if (startOpcode === undefined) {
            startOpcode = ins.opcode;
        }

        prevOpcode = ins.opcode;

        // Attempt to encode the data as a single number.
        const v1 = (data[0] << 0) + (data[1] << 1) + (data[2] << 2);
        const v2 = v1 + (data[3] << 3);

        // If it's a single character, use it.
        if (v2 < 10) {
            curr.push(`/* ${comment} */ ${v2}`);
            return;
        }

        // If each is a single character, write as a double digit number.
        if (v1 < 10 && data[3] < 10) {
            curr.push(`/* ${comment} */ ${v1 * 10 + data[3]}`);
            return;
        }

        // Otherwise, write the values as an array separately.
        curr.push(`/* ${comment} */ [${v1}, ${data[3]}]`);
    });
    flush();
    return out;
})()}};

const SpirvOpDataUnpacked: UnpackedCompressedData = Object.keys(SpirvOpDataCompressed).reduce((acc, k) => {
    for (let i = 0; i < SpirvOpDataCompressed[k].length; ++i) {
        acc[parseInt(k) + i] = SpirvOpDataCompressed[k][i];
    }
    return acc;
}, {});

export const SpirvOpData = (op: number): OpData => {
    const data = SpirvOpDataUnpacked[op];
    if (data === undefined) return defaultData;

    let v1;
    let deltaFromResult;
    if (typeof data === 'number') {
        if (data < 10) {
            v1 = data;
            deltaFromResult = (data >> 3) & 1;
        } else {
            v1 = Math.floor(data / 10);
            deltaFromResult = data - 10 * v1;
        }
    } else {
        v1 = data[0];
        deltaFromResult = data[1];
    }

    return [v1 & 1, v1 & 2, v1 & 4, deltaFromResult];
};

`, 'utf-8');
