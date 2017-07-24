/**
 * webpack.config.babel.js
 */
const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer      = require('autoprefixer-stylus');
const webpack           = require('webpack');
const merge             = require('lodash.merge');
const save_license      = require('uglify-save-license');

const is_dev = (_env => (
  (typeof _env == 'object' && ('dev' in _env)) ? true : false
))((typeof env != 'undefined') ? env : require('yargs').argv.env);

console.log('> ENV: ' + (is_dev ? 'development' : 'production'));
console.log('>');

const dir = __dirname.split(path.sep).pop();
const exclude = new RegExp(
	'(?:node_modules|bower_components|' + dir + path.sep + 'public' + ')'
);
const extract_plugin = new ExtractTextPlugin({
	filename: 'dist/assets/[name].css',
	allChunks: true
});
const asset_name = 'dist/assets/[name].[hash].[ext]';

export default {
	context: path.join(__dirname, 'src'),
	// This project has only 2 entries, namely, "sample" and "vendor".
	entry: {
		// We want "sample.js" as the outcomme for "public/sample/index.html" to use.
		sample: path.resolve(__dirname + '/src/entries/sample/index.js'),
		// We want a separate output for all the vendor provided codes into "vendor.js".
		vendor: [
			'lodash.merge','seedrandom','whatwg-fetch','three',
			'vue','vuex','vue-resource','vue-i18n','vue-router'
		]
	},
	output: {
		// Directory that you want to output your codes and assets to.
		path: path.join(__dirname, 'public'),
		// Filename that you want to output your code to.
		// For this project has only 2 entries,
		// namely, "sample" and "vendor",
		// the [name] would be either "sample" or "vendor".
		filename: 'dist/js/[name].js'
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				include: [ path.join(__dirname, 'src') ],
				exclude,
				use: [{ loader: 'eslint-loader' }]
			},
			{
				test: /\.js$/,
				include: [ path.join(__dirname, 'src') ],
				exclude,
				use: [{ loader: 'babel-loader?compact=false' }]
			},
			{
				test: /\.styl$/,
				include: path.join(__dirname, 'src'),
				use: extract_plugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								modules: true,
								import: true,
								importLoaders: 1, // 1 loaders before (stylus-loader)
								localIdentName: '[local]',
								minimize: false
							}
						},
						{
							loader: 'stylus-loader'
						}
					]
				})
			},
			{
				test: /\.html$/,
				exclude,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: false
					}
				}]
			},
			{
				test: /\.png$/,
				exclude,
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/png',
						name: asset_name
					}
				}]
			},
			{
				test: /\.jpg$/,
				exclude,
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/jpg',
						name: asset_name
					}
				}]
			},
			{
				test: /\.gif/,
				exclude,
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/gif',
						name: asset_name
					}
				}]
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude,
				use: [{
					loader: 'file-loader',
					options: {
						limit: 10000,
						mimetype: 'image/svg+xml',
						name: asset_name
					}
				}]
			},
			{
				test: /\.(woff|woff2)$/,
				exclude,
				use: [{
					loader: 'file-loader',
					options: {
						prefix: 'font',
						limit: 5000,
						name: asset_name
					}
				}]
			}
		]
	},
	...(() => (
		is_dev ? {
			devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
			devServer: {
				// This is optional. Only if you have some assets
				// in the content directory to which you want to refer
				// from the HTML pages.
				contentBase: path.join(__dirname, 'public'),
				host:		process.env.HOST || '127.0.0.1',
				port:		process.env.PORT || '8080',
				historyApiFallback: true,
				noInfo:		true
				// >>> "vue-router" does not work with HMR... \(-_-;)
				// -----------------------------------------------------
				// hot:		true, // hot reload on changes
				// inline:		true // lively refresh the browser page
				// -----------------------------------------------------
			}
		} : {}
	))(),
	resolve: {
		extensions: ['.js'],
		alias: {
			config: path.resolve(
				__dirname, 'src/config/' + (is_dev ? 'dev' : 'prod') + '.js'
			),
			vue: 'vue/dist/vue' + (is_dev ? '' : '.min') + '.js'
		}
	},
	node: {
		fs: 'empty'
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				eslint: {
					configFile: path.join(__dirname, '.eslintrc'),
					formatter: require('eslint-friendly-formatter'),
					emitError: true
				},
				stylus: {
					use: [autoprefixer()]
				},
				context: '/'
			}
		}),
		extract_plugin,
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new webpack.DefinePlugin({
			'process.env': is_dev ? {
				NODE_ENV: JSON.stringify('development'),
				UV_THREADPOOL_SIZE: 128
			} : {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		...(() => (
			is_dev ? []
				: [
					new webpack.optimize.UglifyJsPlugin({
						exclude: /\.html$/,
						compress: {
							warnings: false,
							screw_ie8: true
						},
						output: {
							comments: save_license
						}
					})
				]
		))()
	]
};



