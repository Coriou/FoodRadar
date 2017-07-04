var webpack = require("webpack")
var webpackSourceMapSupport = require("webpack-source-map-support")
var nodeExternals = require("webpack-node-externals")

var PROD = ( process.env.NODE_ENV === 'production' )

var plugins = [
    new webpackSourceMapSupport()
]

if ( PROD )
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { 
                warnings: false 
            }
        })
    )

var node_config = {
    devtool: "cheap-module-source-map",
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        path: `${__dirname}/bin`,
        filename: PROD ?  "bundle.min.js" : "bundle.js",
        libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()],
    target: "node",
    node: {
        __dirname: false
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["latest", "stage-0"],
                    plugins: ["transform-async-to-generator"]
                }
            },
            {
                test: /.json?$/,
                loader: "json-loader"
            }
        ]
    },
    plugins: plugins
}

var postProcess = function(err, stats) {
    if (err) throw err
    console.log(stats.toString("minimal"))
}

var compiler = webpack([node_config])

if (process.argv.indexOf("--compile") !== -1) 
    compiler.run(postProcess)
else if (process.argv.indexOf("--watch") !== -1)
    compiler.watch(null, postProcess)
