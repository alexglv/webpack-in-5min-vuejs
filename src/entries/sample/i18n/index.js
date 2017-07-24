/**
 * entries/sample/i18n/index.js
 * Although we're using "vue-i18n", it does not provide
 * Vuex state managements. So, the bellow settings are for
 * our own state management using Vuex...
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

// A handy library to manage i18n states.
import i18n_manager from '../../../lib/i18n_manager';

export default i18n_manager.create({
	locale: 'ja',
	fallbackLocale: 'ja',
	messages: {
		en: merge({}, require('../../../i18n/en'), require('./en')),
		ja: merge({}, require('../../../i18n/ja'), require('./ja'))
	}
});


