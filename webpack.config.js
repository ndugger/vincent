const path = require('path');
const env = process.env;

const input = 'tests/simple.spec.ts';
const output = 'dist/';

module.exports = {
    mode: 'development',
    entry: {
        example: path.resolve(__dirname, input)
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, output)
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            cortex: __dirname
        },
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx'
        ]
    }
};
