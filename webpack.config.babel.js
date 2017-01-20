/**
 * webpack.config.babel.js
 *
 * ========================================================================
 * This will not be executed if you run webpack with "gulp".
 * It will be carried out only when you run webpack from "npm" command.
 * ========================================================================
 * This is where you export config settings which are then refered from "webpack".
 * Webpack2 allows users to set custom variables using "--env.SOMETHING",
 * however, for some environments are not able to retrieve these variables,
 * we need to use our traditional "yargs" method to supplement this feature.
 */
export default (_env => {
	return _env.dev ? require('./webpack.config.dev.js')
		: require('./webpack.config.prod.js');
})((typeof env != 'undefined') ? env : require('yargs').argv.env);

