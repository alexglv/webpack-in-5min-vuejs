/**
 * webpack.config.dev.js
 */
import path from 'path';
import deepAssign from 'deep-assign';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import common from './webpack.config.common.js';

module.exports = deepAssign({}, common, {
	entry: [
		// >>> "vue-router" does not work with HMR... \(-_-;)
		// 'webpack/hot/dev-server',
		path.resolve(__dirname, 'src/js/app.js')
	],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'app.js'
	},
	module: {
		loaders: [
			...common.module.loaders,
			...[
				{
					test: /\.js$/,
					include: [ path.resolve(__dirname, 'src') ],
					exclude: /(?:node_modules|bower_components|build)/,
					loader: 'babel!eslint'
				},
				{
					test: /\.css$/,
					include: path.resolve(__dirname, 'src'),
					loaders: [
						'style?sourceMap',
						// Instead of using:
						//    localIdentName = [path]___[name]__[local]___[hash:base64:5]
						// using:
						//    localIdentName = [local]
						// allows HTML pages to refer to selector names that are
						// exactly the same as the ones defined in stylesheets.
						'css?modules&importLoaders=1&localIdentName=[local]'
					]
				},
				{
					test: /\.styl$/,
					include: path.resolve(__dirname, 'src'),
					loaders: [
						'style?sourceMap',
						'css?modules&importLoaders=1&localIdentName=[local]',
						'stylus-loader'
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
		noInfo:		true
		// >>> "vue-router" does not work with HMR... \(-_-;)
		// -----------------------------------------------------
		// hot:		true, // hot reload on changes
		// inline:		true // lively refresh the browser page
		// -----------------------------------------------------
	},
	eslint: {
		configFile: path.resolve(__dirname, '.eslintrc.js'),
		formatter: require('eslint-friendly-formatter')
	},
	resolve: {
		extensions: ['', '.js'], // resolves filename even when not specified
		alias: {
			// ex.
			//   var config = require('config');
			//   alert(config.API_KEY);
			config: path.resolve(__dirname, 'src/js/config/dev.js')
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development')
			}
		}),
		new webpack.NoErrorsPlugin(),
		// >>> "vue-router" does not work with HMR... \(-_-;)
		// new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			// Avoid using "html-loader" to load the template page
			// if you want to prevent minification on "index.html".
			template: path.resolve(__dirname, 'src/index.html')
		}),
		new CopyWebpackPlugin([
			// This is just an example that you can copy files.
            {
				from: path.resolve(__dirname, 'src/js/lib/vendor/html5shiv.min.js'),
				to: 'js/lib/vendor/html5shiv.min.js',
				toType: 'file'
			}
		])
	]
});

