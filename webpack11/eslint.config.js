const  EsLintPlugin = require('eslint-webpack-plugin');
module.exports = {
    plugins: [new EsLintPlugin({
        test: /\.js$/,
        exclude: /node_modules/
    })]
}