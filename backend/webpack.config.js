const path = require('path')
const slsw = require('serverless-webpack')
const { webpack } = require('serverless-webpack/lib')

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: 'source-map',
    resolve: {
        extensions: [ '.js', '.json', '.ts' ],
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    target: 'node',
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader'}
        ]
    }
}