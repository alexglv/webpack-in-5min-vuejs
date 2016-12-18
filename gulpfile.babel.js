import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import shell from 'gulp-shell';
import rename from 'gulp-rename';
import seq from 'run-sequence';
import del from 'del';
import webpack from 'webpack';
import webpack_dev_server from 'webpack-dev-server';

let config;

gulp.task('webpack-build', cb => {
	config = require('./webpack.config.prod.js');
	webpack(config)
		.run((err, stats) => {
			if (err) { throw new gutil.PluginError('webpack-build', err); }
			gutil.log('[webpack-build]', stats.toString({
				colors: true
			}));
			cb();
		});
});

gulp.task('webpack-dev-server', cb => {
	config = require('./webpack.config.dev.js');
	new webpack_dev_server(webpack(config))
		.listen(8080, 'localhost', function(err) {
			if (err) {
				throw new gutil.PluginError('webpack-dev-server', err);
			}
			gutil.log(
				'[webpack-dev-server]',
				'http://localhost:8080/webpack-dev-server/index.html'
			);
		});
});

gulp.task('dev', cb => { seq('webpack-dev-server', cb); });
gulp.task('prod', cb => { seq('webpack-build', cb); });
gulp.task('default', ['dev']);

