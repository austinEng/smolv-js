
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

type OpData = {
    hasResult: boolean;      // does it have result ID?
    hasType: boolean;        // does it have type ID?
    deltaFromResult: number; // How many words after (optional) type+result to write out as deltas from result?
    varrest: boolean;        // should the rest of words be written in varint encoding?
};

const defaultData: OpData = {
    hasResult: true,
    hasType: true,
    deltaFromResult: 0,
    varrest: false
};

const _SpirvOpData = {
${instructions.filter(i => i).map(ins => {
    const opData = OpData[ins.opcode];
    const data = [hasResult(ins), hasType(ins), opData ? opData[0] : 0, opData ? opData[1] : 0];
    const comment = `[${data.join(', ')}] ${ins.opname}`;

    // Strip defaults to save space. We'll infer them if undefined.
    const defaults = [1, 1, 0, 0];
    let i = data.length;
    for (; i >= 1; --i) if (data[i - 1] !== defaults[i - 1]) break;
    if (i === 0) return `    /* ${comment} */`;

    const sliced = data.slice(0, i);

    return `    /* ${comment} */ ${ins.opcode}: [${sliced.join(', ')}],`
}).join('\n')}
};

export const SpirvOpData = (op: number): OpData => {
    const data = _SpirvOpData[op];
    if (!data) return defaultData;
    return {
        hasResult: data[0] !== undefined ? data[0] : defaultData.hasResult,
        hasType: data[1] !== undefined ? data[1] : defaultData.hasType,
        deltaFromResult: data[2] !== undefined ? data[2] : defaultData.deltaFromResult,
        varrest: data[3] !== undefined ? data[3] : defaultData.varrest,
    };
};

`, 'utf-8');
