/**
 * webpack.config.dev.js
 */
const path = require('path');
const merge = require('lodash.merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.config.common.js');

// Overwrite "common.base" with "dev" specific configurations.
// Use "module.exports" in case some other modules using this module in commonJS way.
module.exports = merge({}, common, {
	entry: [
		// >>> "vue-router" does not work with HMR... \(-_-;)
		// 'webpack/hot/dev-server',
		path.resolve(__dirname, 'src/index.js')
	],
	output: {
		filename: 'app.js'
	},
	module: {
		rules: [
			...common.module.rules,
			...[
				{
					test: /\.js$/,
					include: [ path.join(__dirname, 'src') ],
					exclude: /(?:node_modules|bower_components|build)/,
					use: [{ loader: 'babel-loader' }]
				},
				{
					test: /\.css$/,
					include: path.join(__dirname, 'src'),
					use: [
						{
							loader: 'style-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'css-loader',
							options: {
								modules: true,
								import: true,
								// 1 loaders ("style-loader") loaded before
								importLoaders: 1,
								// Avoid:
								//	  localIdentName: [path]___[name]__[local]___[hash:base64:5]
								// but use:
								//	  localIdentName: [local]
								// to enable HTMLs to refer to selectors that
								// are exactly what defined in your stylesheets.
								localIdentName: '[local]'
							}
						}
					]
				},
				{
					test: /\.styl$/,
					include: path.join(__dirname, 'src'),
					use: [
						{
							loader: 'style-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'css-loader',
							options: {
								modules: true,
								import: true,
								// 1 loader ("stylus-loader") loaded before
								importLoaders: 1,
								// Avoid:
								//	  localIdentName: [path]___[name]__[local]___[hash:base64:5]
								// but use:
								//	  localIdentName: [local]
								// to enable HTMLs to refer to selectors that
								// are exactly what defined in your stylesheets.
								localIdentName: '[local]'
							}
						},
						{
							loader: 'stylus-loader'
						}
					]
				}
			]
		]
	},
	// WEBPACK_DEVTOOL defaults to "eval" in development environment,
	// and "source-map" in production environment.
	// If it isn't there at all, we specify "eval-source-map".
	// With "eval-source-map", each module is executed with "eval"
	// and a SourceMap is added as DataUrl to the "eval".
	devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
	devServer: {
		// This is optional. Only if you have some assets
		// in the content directory to which you want to refer
		// from the HTML pages.
		contentBase: path.join(__dirname, 'build'),
		host:		process.env.HOST || '127.0.0.1',
		port:		process.env.PORT || '8080',
		historyApiFallback: true,
		// If not showing info, the build stops with "95% emitting", and is misleading.
		noInfo:		false
		// >>> "vue-router" does not work with HMR... \(-_-;)
		// -----------------------------------------------------
		// hot:		true, // hot reload on changes
		// inline:		true // lively refresh the browser page
		// -----------------------------------------------------
	},
	resolve: {
		alias: {
			// ex.
			//	 var config = require('config');
			//	 alert(config.API_KEY);
			config: path.resolve(__dirname, 'src/config/dev.js')
		}
	},
	plugins: [
		...common.plugins,
		...[
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('development'),
					UV_THREADPOOL_SIZE: 128
				}
			}),
			new webpack.NoEmitOnErrorsPlugin()
			// >>> "vue-router" does not work with HMR... \(-_-;)
			// new webpack.HotModuleReplacementPlugin()
		]
	]
});

