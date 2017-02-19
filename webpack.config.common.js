/**
 * webpack.config.common.js
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common_exclude_path = new RegExp('(?:node_modules|bower_components|build)');

module.exports = {
	// Remove the heading "src" from the output paths of images
	// when [path] is specified for "file-loader" on the images.
	// ex.
	//   instead of: <img src="src/images/test.jpg" />
	//   it will be: <img src="images/test.jpg" />
	context: path.join(__dirname, 'src'),
	output: {
		path: path.join(__dirname, 'build')
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				include: [ path.join(__dirname, 'src') ],
				exclude: /(?:node_modules|bower_components|build)/,
				use: [{ loader: 'eslint-loader' }]
			},
			{
				test: /\.html$/,
				exclude: common_exclude_path,
				// Setting "?-minimize" or "?minimize=false" prevents "build/index.html"
				// from being minified. Make sure NOT to apply "html-loader"
				// to HtmlWebpackPlugin (when you specify its template).
				use: [{
					loader: 'html-loader',
					options: {
						// Prevents "build/index.html" from being minified.
						// Make sure NOT to apply "html-loader"
						// to HtmlWebpackPlugin (when you specify its template).
						minimize: false
					}
				}]
			},
			{
				test: /\.png$/,
				exclude: common_exclude_path,
				// Use "file-loader" instead of "url-loader"
				// to prevent image data to be converted to Base64.
				// Also, avoid [path][name].[hash].[ext] for filenames
				// otherwise it will becomes the local path (ex. file://...)
				// and the path will not be resolved:
				//    "Not allowed to load local resource"
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/png',
						name: '[name].[hash].[ext]'
					}
				}]
			},
			{
				test: /\.jpg$/,
				exclude: common_exclude_path,
				// Use "file-loader" instead of "url-loader"
				// to prevent image data to be converted to Base64.
				// Also, avoid [path][name].[hash].[ext] for filenames
				// otherwise it will becomes the local path (ex. file://...)
				// and the path will not be resolved:
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/jpg',
						name: '[name].[hash].[ext]'
						// name: '[name].[ext]'
					}
				}]
			},
			{
				test: /\.gif/,
				exclude: common_exclude_path,
				// Use "file-loader" instead of "url-loader"
				// to prevent image data to be converted to Base64.
				// Also, avoid [path][name].[hash].[ext] for filenames
				// otherwise it will becomes the local path (ex. file://...)
				// and the path will not be resolved:
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/gif',
						name: '[name].[hash].[ext]'
						// name: '[name].[ext]'
					}
				}]
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude: common_exclude_path,
				// Use "file-loader" instead of "url-loader"
				// to prevent image data to be converted to Base64.
				// Also, avoid [path][name].[hash].[ext] for filenames
				// otherwise it will becomes the local path (ex. file://...)
				// and the path will not be resolved:
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/svg+xml',
						name: '[name].[hash].[ext]'
					}
				}]
			},
			{
				test: /\.(woff|woff2)$/,
				exclude: common_exclude_path,
				// Use "file-loader" instead of "url-loader"
				// to prevent image data to be converted to Base64.
				// Also, avoid [path][name].[hash].[ext] for filenames
				// otherwise it will becomes the local path (ex. file://...)
				// and the path will not be resolved:
				use: [{
					loader: 'file-loader',
					options: {
						prefix: 'font',
						limit: 5000,
						name: '[name].[hash].[ext]'
					}
				}]
			}
		]
	},
	resolve: {
		extensions: ['.js'], // resolves filename even when not specified
		alias: {
			// ex.
			//   var config = require('config');
			//   alert(config.API_KEY);
			vue: 'vue/dist/vue.js'
		}
	},
	// Include polyfills or mocks for various node stuff.
	node: {
		// Some npm modules expect to have "fs" (where browser doesn't).
		fs: 'empty'
	},
	plugins: [
		new HtmlWebpackPlugin({
			// Avoid using "html-loader" to load the template page
			// if you want to prevent minification on "index.html".
			template: path.resolve(__dirname, 'src/index.html'),
			xhtml: true
		}),
		new CopyWebpackPlugin([
			// This is just an example that you can copy files.
			{
				from: path.resolve(__dirname, 'src/lib/vendor/html5shiv.min.js'),
				to: 'js/lib/vendor'
			}
		]),
		new webpack.LoaderOptionsPlugin({
			options: {
				eslint: {
					configFile: path.join(__dirname, '.eslintrc'),
					formatter: require('eslint-friendly-formatter'),
					// https://github.com/MoOx/eslint-loader#emiterror-default-false
					emitError: true
				}
			}
		})
	]
};
