/**
 * entries/sample/config.js
 * Config specific to "sample" entry. Merging with
 * base configs that are common to all the entries.
 */
import merge from 'lodash.merge';

module.exports = merge({}, require('config'), {
    service: {
        page: 'sample'
    }
});

