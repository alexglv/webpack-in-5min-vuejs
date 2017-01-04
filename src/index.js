/**
 * index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);

import _css from './index.styl';
import store from './store.js';
import config from 'config';
import utils from './lib/utils.js';
import grid_page from './routes/grid/grid.js';
import wiki_page from './routes/wiki/wiki.js';

const router = new VueRouter({
	routes: [
		{ path: '/', redirect: '/grid' },
		{ name: 'grid', path: '/grid', component: grid_page },
		{ name: 'wiki', path: '/wiki', component: wiki_page }
	]
});

const App = new Vue({
	store,
	router
});

utils.document_ready()
	.then(() => {
		console.log('API_KEY: ' + config['API_KEY']);
		console.log('API_URL: ' + config['API_URL']);
		App.$mount('#container-wrapper');
	})
	.catch(e => {
		throw e;
	});


