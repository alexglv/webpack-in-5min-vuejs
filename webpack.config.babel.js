/**
 * webpack.config.babel.js
 *
 * This is where you export config settings which are then refered from "webpack".
 * Webpack2 allows users to set custom variables using "--env.SOMETHING",
 * however, this feature is not available for some environments
 * and we use our traditional "yargs" to supplement this feature.
 */
export default (_env => {
	return _env.dev ? require('./webpack.config.dev.js')
		: require('./webpack.config.prod.js');
})((typeof env != 'undefined') ? env : require('yargs').argv.env);

