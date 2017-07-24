/**
 * lib/i18n_manager_manager/index.js
 *
 * Example:
 *
 * ---------------------------------------------------------
 * app.js
 * ---------------------------------------------------------
 *
 * import Vue from 'vue';
 * import VueI18n from 'vue-i18n';
 * Vue.use(VueI18n);
 * import i18n_manager from '../../i18n_manager';
 *
 * const i18n_data = {
 *     en: require('./i18n/en'),
 *     ja: require('./i18n/ja')
 * };
 *
 * new Vue({
 *     el: '#my-app',
 *     i18n: i18n_manager.create({
 *         locale: 'ja',
 *         fallbackLocale: 'ja',
 *         messages: i18n_data
 *     }),
 *     methods: {
 *         translate(key) {
 *             return this.$i18n.t(key);
 *         },
 *         set_locale(locale) {
 *             this.$store.dispatch('set_locale', locale);
 *         }
 *     }
 * });
 *
 * ---------------------------------------------------------
 * index.html
 * ---------------------------------------------------------
 *
 * <div id="container">
 *     <span>{{ translate('products.vegetables.apple.name') }}</span>
 * </div>
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const assign = merge;

const DEFAULT_LOCALE = 'en';
const DEFAULT_LOCALE_FALLBACK = 'en';

export default {
	create
};

function create(params = {}) {

	const {
		locale = DEFAULT_LOCALE,
		fallbackLocale = DEFAULT_LOCALE_FALLBACK,
		messages = { en: {}, ja: {} }
	} = params;

	return new VueI18n({
		locale, fallbackLocale, messages: assign({}, messages)
	});
}

