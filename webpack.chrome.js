const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common, {
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./src/manifest.json" }
            ]
        }),
        new webpack.DefinePlugin({
            ENGINE: JSON.stringify('chrome'),
        }),
    ]
})
