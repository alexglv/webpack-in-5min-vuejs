/**
 * webpack.config.prod.js
 */
import path from 'path';
import deepAssign from 'deep-assign';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import save_license from 'uglify-save-license';
import common from './webpack.config.common.js';

module.exports = deepAssign({}, common, {
	entry: {
		app: path.resolve(__dirname, 'src/js/app.js')
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
		loaders: [
			...common.module.loaders,
			...[
				{
					test: /\.js$/,
					include: [ path.join(__dirname, 'src') ],
					exclude: /(?:node_modules|bower_components|build)/,
					loader: 'babel'
				},
				{
					test: /\.css$/,
					include: path.join(__dirname, 'src'),
					loader: ExtractTextPlugin.extract(
						'style',
						// "-minimize" disables minification
						'css?modules&importLoaders=1&localIdentName=[local]&-minimize'
					)
				},
				{
					test: /\.styl$/,
					include: path.join(__dirname, 'src'),
					loader: ExtractTextPlugin.extract(
						'style',
						// "-minimize" disables minification
						'css?modules&importLoaders=1&localIdentName=[local]&-minimize!stylus-loader'
					)
				}
			]
		]
	},
	resolve: {
		alias: {
			// ex.
			//   var config = require('config');
			//   alert(config.API_KEY);
			config: path.resolve(__dirname, 'src/js/config/prod.js')
		}
	},
	plugins: [
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
		new webpack.optimize.OccurenceOrderPlugin(),
		// Search for equal or similar files and deduplicate them in the output.
		// This comes with some overhead for the entry chunk,
		// but can reduce file size effectively.
		// https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
		new webpack.optimize.DedupePlugin(),
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
		new ExtractTextPlugin(
			// Because it currently does not support [path] syntax in ExtractTextPlugin,
			// we simply output the bundled CSS to public (root) directory.
			'[contenthash].css',
			{
				// While it extracts only from the initial chunks by default,
				// setting it "true" extracts from all additional chunks too.
				allChunks: true
			}
		)
	]
});

