/**
 * entries/sample/store.js
 * The store specific to "sample" entry.
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import utils from '../../lib/utils';
import i18n from '../../i18n/store';
import wiki from './routes/wiki_store.js';
import share from '../../store';

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
        share
    }
});

