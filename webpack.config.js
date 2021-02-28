const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
        index: '/src/index.js',
        background: '/src/background/index.js',
        sniffer: '/src/sniffer/index.js',
        settings: '/src/settings/index.js',
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
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "src/image", to: "image" },
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
                case 'index':
                    return 'index.js'
                case 'css':
                    return 'index.css'
                default:
                    return '[name]/index.js'
            }
        },
    },
};
