/**
 * app.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);

import _css from '../css/main.styl';
import store from './store/index.js';
import config from 'config';
import utils from './lib/utils.js';
import main_page from './pages/main.js';
import wiki_page from './pages/wiki.js';

const router = new VueRouter({
	routes: [
		{ path: '/', redirect: '/main' },
		{ name: 'main', path: '/main', component: main_page },
		{ name: 'wiki', path: '/wiki', component: wiki_page }
	]
});

(async function(){
	await utils.document_ready();
	console.log('API_KEY: ' + config['API_KEY']);
	console.log('API_URL: ' + config['API_URL']);
	const app = new Vue({
		store,
		router
	}).$mount('#container-wrapper');

})();


