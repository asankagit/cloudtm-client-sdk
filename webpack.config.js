const path = require('path');

module.exports = {
    entry: './tagmanager.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-env',
                                {
                                    "targets": {
                                        "esmodules": true,
                                    },
                                },
                            ]
                        ],
                    }
                }
            }
        ]
    },
    devtool: "source-map",
    resolve: {
        extensions: [".html", ".js", ".json", ".css"]
    }
};