/**
 * webpack.config.common.js
 */
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

var common_exclude_path = new RegExp('(?:node_modules|bower_components|build)');

export default {
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
		loaders: [
			{
				enforce: 'pre',
				test: /\.js$/,
				include: [ path.join(__dirname, 'src') ],
				exclude: /(?:node_modules|bower_components|build)/,
				loader: 'eslint'
			},
			{
				test: /\.html/,
				exclude: common_exclude_path,
				// Setting "?-minimize" or "?minimize=false" prevents "build/index.html"
				// from being minified. Make sure NOT to apply "html-loader"
				// to HtmlWebpackPlugin (when you specify its template).
				loader: 'html?-minimize'
			},
			{
				test: /\.png/,
				exclude: common_exclude_path,
				// Using "file-loader" instead of "url-loader" to prevent from
				// the image data to be converted to Base64.
				loader: 'file?limit=10000&mimetype=image/png&name=[path][name].[hash].[ext]'
			},
			{
				test: /\.jpg/,
				exclude: common_exclude_path,
				loader: 'file?limit=10000&mimetype=image/jpg&name=[path][name].[hash].[ext]'
			},
			{
				test: /\.gif/,
				exclude: common_exclude_path,
				loader: 'file?limit=10000&mimetype=image/gif&name=[path][name].[hash].[ext]'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude: common_exclude_path,
				loader: 'file?limit=10000&mimetype=image/svg+xml&name=[path][name].[hash].[ext]'
			},
			{
				test: /\.(woff|woff2)$/,
				exclude: common_exclude_path,
				loader: 'file?prefix=font/&limit=5000&name=[path][name].[hash].[ext]'
			}
		]
	},
	eslint: {
		configFile: path.join(__dirname, '.eslintrc'),
		formatter: require('eslint-friendly-formatter')
	},
	resolve: {
		extensions: ['', '.js'], // resolves filename even when not specified
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
				from: path.resolve(__dirname, 'src/js/lib/vendor/html5shiv.min.js'),
				to: 'js/lib/vendor'
			}
		])
	]
};
