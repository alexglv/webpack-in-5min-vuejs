/**
 * config/prod.js
 */
import merge from 'lodash.merge';

module.exports = merge({}, require('./common.js'), {
	api: {
		url: 'https://www.google.com',
		key: '9999-9999-9999-9999',
		headers: {
			'X-Harry-Potter-Identity': 'dev'
		}
	}
});

