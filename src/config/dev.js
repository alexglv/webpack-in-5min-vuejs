/**
 * config/dev.js
 */
import merge from 'lodash.merge';

module.exports = merge({}, require('./common.js'), {
	api: {
		url: 'http://localhost:8080',
		key: '1111-1111-1111-1111',
		headers: {
			'X-Harry-Potter-Identity': 'dev'
		}
	}
});

