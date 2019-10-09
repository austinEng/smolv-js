const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const makeConfig = ({ target, extPrefix }) => ({
    mode: 'production',
    target: target,
    entry: {
        smolv: path.resolve(__dirname, '../src/smolv'),
        encode: path.resolve(__dirname, '../src/encode'),
        decode: path.resolve(__dirname, '../src/decode'),
    },
    output: {
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '../dist'),
        filename: `[name]${extPrefix}.js`
    },
    optimization: {
        minimize: true,
        minimizer: [
            // Gets smaller size than default Webpack minification
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    ecma: 6,
                    compress: true,
                    mangle: true,
                    compress: {
                        ecma: 6,
                        hoist_funs: true,
                        hoist_props: true,
                        keep_fargs: false, // You need this for code which relies on Function.length
                        module: true,
                        passes: 3,
                        unsafe_arrows: true, //  Note: it is not always safe to perform this conversion if code relies on the the function having a prototype, which arrow functions lack.
                    },
                    mangle: true,
                }
            }),
        ]
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../gen'),
        ]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: target === 'web' ? [
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js)$/,
            compressionOptions: { level: 9 },
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js)$/,
            compressionOptions: { level: 11 },
        }),
    ] : undefined,
});

module.exports = [
    makeConfig({ target: 'web', extPrefix: '' }),
    makeConfig({ target: 'node', extPrefix: '.node' }),
];
