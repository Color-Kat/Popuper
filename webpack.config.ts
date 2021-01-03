// Webpack modules import
import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

// Webpack plugins require
import UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// Common node module functions import
import { resolve } from "path";

/*
	Webpack preferences
*/
const distPath = "dist";
const entryPoints = {
	popuper: "./src/popuper.ts"
};

// Webpack configuration
module.exports = {
	target: "web",
	mode: "development",

	devtool: "eval-source-map",
	resolve: { extensions: [ ".ts", ".js" ] },

	parallelism: 4,
	entry: entryPoints,

	output: {
		filename: "[name].js",
		path: resolve(distPath),
		libraryTarget: "commonjs2"
	},

	module: {
		rules: [ { test: /\.tsx?$/, loader: "ts-loader", exclude: resolve("tests") } ]
	},

	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				extractComments: false,
				uglifyOptions: {
					compress: true,
					ie8: true,
					output: { comments: false },
					safari10: true
				}
			})
		],

		splitChunks: {
			chunks: "all",
			maxAsyncRequests: 16,
			maxInitialRequests: 20,

			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name (module: any) {
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](.*?)([\\/]|$)/
						)[1];
						return `module~${packageName.replace("@", "~")}`;
					}
				}
			}
		},

		providedExports: true,
		concatenateModules: true,
		usedExports: true,
		removeAvailableModules: true
	}
} as Webpack.Configuration;
