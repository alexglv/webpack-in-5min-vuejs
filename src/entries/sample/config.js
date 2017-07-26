/**
 * entries/sample/config.js
 */
import merge from 'lodash.merge';

module.exports = merge({}, require('config'), {
	service: {
		page: 'sample'
	}
});

