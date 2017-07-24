/**
 * entries/sample/store.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import utils from '../../lib/utils';
import i18n from '../../lib/i18n_manager/i18n_store';
import wiki from './routes/wiki_store.js';
import shared from '../../shared_store';

export default new Vuex.Store({
	strict: true,
	state: {
	},
	getters: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		i18n,
		wiki,
		shared
	}
});

