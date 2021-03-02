const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const WebExtWebpackPlugin = require('web-ext-webpack-plugin')
const path = require('path')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/manifest.json",
                    transform (buffer) {
                        const manifest = JSON.parse(buffer.toString());
                        manifest.browser_specific_settings = {
                            "gecko": {
                                "id": "laracasts-discuss-push-notify@twocomrades.ru"
                            }
                        }
                        return JSON.stringify(manifest, null, 2);
                    }
                }
            ]
        }),
        new webpack.DefinePlugin({
            ENGINE: JSON.stringify('firefox')
        }),
        new WebExtWebpackPlugin({
            sourceDir: path.resolve(__dirname, 'extension'),
            startUrl: 'https://laracasts.com/discuss'
        }),
    ]
})
