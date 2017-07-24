/**
 * lib/i18n_manager/i18n_store.js
 */
import Vue from 'vue';

export default {
	state: {
		locale_list: ['en','ja'],
		locale: 'en'
	},
	getters: {
		// locale: state => state.locale
	},
	mutations: {
		set_locale_list(state, list = []) {
			state.locale_list = list;
		},
		set_locale(state, locale = '') {
			let regexp = '^(?:' + (state.locale_list.join('|')) + ')$';
			if ((new RegExp(regexp)).test(locale)) {
				state.locale = locale;
			}
		}
	},
	actions: {
		set_locale_list({state, dispatch, commit}, list = []) {
			commit('set_locale_list', list);
		},
		set_locale({state, dispatch, commit}, locale = '') {
			commit('set_locale', locale);
		}
	}
};

