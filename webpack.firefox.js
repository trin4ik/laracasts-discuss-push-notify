const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/manifest.json",
                    transform (buffer) {
                        const manifest = JSON.parse(buffer.toString());

                        // make any modifications you like, such as
                        manifest.browser_specific_settings = {
                            "gecko": {
                                "id": "laracasts-discuss-push-notify@twocomrades.ru"
                            }
                        }
                        return JSON.stringify(manifest, null, 2);
                    }
                }
            ]
        })
    ]
})
