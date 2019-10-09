const fs = require('fs');
const path = require('path');
const brotli = require('brotli');

const decode = require('../dist/decode.node').default;
const encode = require('../dist/encode.node').default;

const dirs = [
    path.resolve(__dirname, '../node_modules/smol-v/tests/spirv-dumps/dota2'),
    path.resolve(__dirname, '../node_modules/smol-v/tests/spirv-dumps/dxc'),
    path.resolve(__dirname, '../node_modules/smol-v/tests/spirv-dumps/shadertoy'),
    path.resolve(__dirname, '../node_modules/smol-v/tests/spirv-dumps/talos'),
    path.resolve(__dirname, '../node_modules/smol-v/tests/spirv-dumps/unity'),
];

dirs.forEach(dir => {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        function testEncodeDecode(file) {
            const filePath = path.join(dir, file);
            const contents = fs.readFileSync(filePath);

            const encoded = encode(contents.buffer, contents.byteOffset, contents.byteLength);
            const decoded = decode(encoded.buffer, encoded.byteOffset, encoded.byteLength);

            if (contents.byteLength !== decoded.byteLength) {
                throw new Error(`Decoded length is different: ${contents.byteLength} vs ${decoded.byteLength}`);
            }
            for (let i = 0; i < contents.byteLength; ++i) {
                if (contents[i] !== decoded[i]) {
                    throw new Error('Decoded result is different');
                }
            }

            console.log(file)
            console.log(`  Decoded:\t${decoded.byteLength}`);
            console.log(`  Encoded:\t${encoded.byteLength}\t${encoded.byteLength / decoded.byteLength * 100}%`);

            const brotliOptions = {
                mode: 0,
                quality: 11,
                lgwin: 22,
                lgblock: 0,
                enable_dictionary: true,
                enable_transforms: true,
                greedy_block_split: false,
                enable_context_modeling: false,
            };
            const decodedBr = brotli.compress(Buffer.from(decoded.buffer, decoded.byteOffset, decoded.byteLength), brotliOptions);
            const encodedBr = brotli.compress(Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength), brotliOptions);

            if (decodedBr) {
                console.log(`  Decoded.br:\t${decodedBr.byteLength}\t${decodedBr.byteLength / decoded.byteLength * 100}%`);
            }
            if (encodedBr) {
                console.log(`  Encoded.br:\t${encodedBr.byteLength}\t${encodedBr.byteLength / decoded.byteLength * 100}%`);
            }
        };

        files.forEach(testEncodeDecode);
    });
});
