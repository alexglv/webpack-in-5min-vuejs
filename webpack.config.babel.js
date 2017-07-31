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

const sep = path.sep;
const dir = __dirname.split(sep).pop(); // Ex. "webpack-in-5min-vuejs"

// For module loader rules. Specifically for asset loader options.
const asset_name = 'dist/assets/[name].[hash].[ext]';

// For module loader rules. Specifically for asset loader options.
const include = [ path.join(__dirname, 'src') ];

// For module loader rules. Specifically for asset loader options.
// Exclude "public" to imply "public/dist" where you have built files.
const exclude = new RegExp(
	'(?:node_modules|bower_components|' + dir + sep + 'public' + ')'
);

// Not really necessary, but making it an instace
// because "ExtractTextPlugin" use used twice.
// (for "stylus-loader" and "CommonsChunkPlugin")
const extract_plugin = new ExtractTextPlugin({
	filename: 'dist/assets/[name].css', allChunks: true
});

export default {
	// "context" is essential when resolving paths
	// for your program codes and assets.
	context: path.join(__dirname, 'src'),
	// This project has only 2 entries, namely, "sample" and "vendor".
	entry: {
		// "public/sample/sample.html" needs "dist/js/sample.js".
		sample: path.resolve(__dirname + '/src/entries/sample/index.js'),
		// "public/sample/sample.html" needs "dist/js/vendor.js".
		vendor: [
			'lodash.merge','seedrandom','whatwg-fetch','rxjs','three',
			'vue','vuex','vue-resource','vue-i18n','vue-router'
		]
	},
	output: {
		// Directory to output all the assets.
		path: path.join(__dirname, 'public'),
		// Filename to output your JS files.
		// (where [name] being "sample" or "vendor")
		filename: 'dist/js/[name].js'
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				include,
				exclude,
				use: [{ loader: 'eslint-loader' }]
			},
			{
				test: /\.js$/,
				include,
				exclude,
				use: [{ loader: 'babel-loader?compact=false' }]
			},
			{
				test: /\.styl$/,
				include,
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
				// Optional. Specifiy "contentBase" when you have
				// assets placed in your document directory.
				contentBase: path.join(__dirname, 'public'),
				host:		process.env.HOST || '127.0.0.1',
				port:		process.env.PORT || '8080',
				historyApiFallback: true,
				noInfo:		true
				// "vue-router" does not work with HMR.... \(-_-;)
				// -----------------------------------------------------
				// hot:		true, // hot reload on changes
				// inline:		true // lively refresh the browser page
				// -----------------------------------------------------
			}
		} : {}
	))(),
	resolve: {
		// You can require modules even if you omit the file extentions.
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



