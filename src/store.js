/**
 * store.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import wiki from './routes/wiki/wiki_store.js';

export default new Vuex.Store({
	actions: {},
	getters: {},
	modules: {
		wiki
	},
    strict: true
});

