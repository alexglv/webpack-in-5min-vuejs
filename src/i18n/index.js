/**
 * i18n/index.js
 * All the entries use "create" to create a new "vue-i18n" instance.
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

exports.create = (params = {}) => (
    new VueI18n(merge({
        locale: 'en',
        fallbackLocale: 'en',
        messages: {
            en: require('./en'),
            ja: require('./ja')
        }
    }, params))
);

