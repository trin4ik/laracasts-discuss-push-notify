const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ZipPlugin = require('zip-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        background: './src/background.js',
        content: './src/content.js',
        options: './src/options.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/transform-runtime',
                        ]
                    }
                }
            },
            {
                test: /\.(css)|(s[ac]ss)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new ZipPlugin({
            filename: 'extension.zip'
        }),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            ENGINE: JSON.stringify('firefox')
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            title: 'options',
            template: "src/template.html",
            templateParameters: {
                scripts: ['browser-polyfill.js'],
            },
            filename: "options.html"
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "./src/image/", to: 'image' },
                { from: "./node_modules/webextension-polyfill/dist/browser-polyfill.js" },
            ],
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'extension'),
        filename: '[name].js'
    },
}
