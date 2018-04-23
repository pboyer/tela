var path = require('path');

module.exports = {
    entry: {
        app: "./src/app.tsx",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.ttf|.otf|.eot|.woff|.svg|.png$/,
                loader: "file-loader",
                options: {
                    name: 'node_modules/dynamo-hosted-contents/src/resources/fonts/[name].[ext]'
                }
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "immutable": "Immutable"
    },
};