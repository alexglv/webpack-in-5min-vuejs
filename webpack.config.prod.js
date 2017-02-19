/**
 * webpack.config.prod.js
 */
const path = require('path');
const merge = require('lodash.merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const save_license = require('uglify-save-license');
const common = require('./webpack.config.common.js');

// Overwrite "common.base" with "prod" specific configurations.
// Use "module.exports" in case some other modules using this module in commonJS way.
module.exports = merge({}, common, {
	entry: {
		app: path.resolve(__dirname, 'src/index.js')
	},
	output: {
		// hash is calculated for a build, chunkhash is calculated
		// for chunk (entry file), contenthash is special hash generated
		// in ExtractTextPlugin and is calculated by extracted content,
		// not by whole chunk content
		// https://github.com/webpack/extract-text-webpack-plugin/issues/153
		filename: '[name].[chunkhash].js'
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
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: true,
									import: true,
									// 0 loaders loaded before
									importLoaders: 0,
									localIdentName: '[local]',
									minimize: false
								}
							}
						]
					})
				},
				{
					test: /\.styl$/,
					include: path.join(__dirname, 'src'),
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: true,
									import: true,
									// 1 loaders ("style-loader") loaded before
									importLoaders: 0,
									localIdentName: '[local]',
									minimize: false
								}
							},
							{
								loader: 'stylus-loader'
							}
						]
					})
				}
			]
		]
	},
	resolve: {
		alias: {
			// ex.
			//	 var config = require('config');
			//	 alert(config.API_KEY);
			config: path.resolve(__dirname, 'src/config/prod.js')
		}
	},
	plugins: [
		...common.plugins,
		...[
			// This webpack plugin cleans up the extraneous files from the webpack's output path.
			// Since it runs when the compile process is finished,
			// it is useful when building on production to remove
			// the assets created by previous builds.
			// https://github.com/gpbl/webpack-cleanup-plugin
			new WebpackCleanupPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					// When set to "production", it minifies the codes and removes
					// all the affordances specific to development environment.
					NODE_ENV: JSON.stringify('production')
				}
			}),
			// Assign the module and chunk ids by occurrence count.
			// Ids that are used often get lower (shorter) ids.
			// This make ids predictable, reduces total file size and is recommended.
			// https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
			new webpack.optimize.OccurrenceOrderPlugin(),
			new webpack.optimize.UglifyJsPlugin({
				exclude: /\.html$/,
				compress: {
					warnings:		false,
					// Use this flag if you don't wish to
					// support Internet Explorer 6-8 quirks.
					screw_ie8:		true
				},
				output: {
					// A support module for UglifyJS to detect and preserve license comments.
					// https://github.com/shinnn/uglify-save-license
					comments: save_license
				}
			}),
			new ExtractTextPlugin({
				// Because it currently does not support [path] syntax in ExtractTextPlugin,
				// we simply output the bundled CSS to build (root) directory.
				filename: '[contenthash].css',
				// While it extracts only from the initial chunks by default,
				// setting it "true" extracts from all additional chunks too.
				allChunks: true
			})
		]
	]
});

