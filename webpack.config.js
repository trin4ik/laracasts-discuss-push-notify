const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        background: '/src/background/index.js',
        settings: '/src/settings/index.js',
        page: '/src/page/index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-react'],
                        plugins: ["@babel/plugin-proposal-class-properties"]
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
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "src/image", to: "image" },
                { from: "src/settings/index.html", to: "settings.html" },
            ],
        }),
    ],
    optimization: {
        minimize: true,

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (pathData) => {
            switch (pathData.chunk.name) {
                default:
                    return '[name].js'
            }
        },
    },
};
