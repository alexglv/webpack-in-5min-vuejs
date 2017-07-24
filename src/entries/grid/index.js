/**
 * entries/grid/index.js
 */
import merge from 'lodash.merge';
import 'whatwg-fetch';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { mapState } from 'vuex';
import VueResource from 'vue-resource';
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);

import config_0 from 'config';
import config_1 from './config';
import utils from '../../lib/utils';
import store from './store';
import i18n from './i18n';
import route_to_grid from './routes/grid';
import route_to_wiki from './routes/grid2';
import './style.styl';

const assign          = merge;
const compose         = utils.compose;
const curry           = utils.curry;
const pipe            = utils.pipe;
const prop            = utils.prop;
const map             = utils.map;
const path            = utils.path;
const Maybe           = utils.Maybe;
const get_children    = utils.maybe_get_children;
const obj_keys_size   = utils.obj_keys_size;

const config = assign({}, config_0, config_1);

// Consider making "router" into an external module
// if you are not referencing local methods or variables.
//
// http://localhost:8080/grid.html#/grid
// http://localhost:8080/grid.html#/wiki
//
// Sometimes you want "/" instead of "#".
// Such that:
//    http://localhost:8080/grid.html/grid
//    http://localhost:8080/grid.html/wiki
// If such the case, set the routing "mode" specifically to "history":
//    {
//       mode: 'history',
//    }
// Also, since your server will mistakenly consider "grid.html" to be a directory,
// so you need a special routing in your server-side application.
//
// then you have "/" instead of "#".
// {
//    mode: 'history',
//    base: '/v1/app',
// }
// http://localhost:8080/v1/app/grid
// http://localhost:8080/v1/app/wiki
//
//
const router = new VueRouter({
	base: '/',
	routes: [
		{ path: '/', redirect: '/grid' },
		{
			name: 'grid',
			path: '/grid',
			component: route_to_grid
			// beforeEnter: (to, from, next) => { next(); }
		},
		{
			name: 'wiki',
			path: '/wiki',
			component: route_to_wiki
			// beforeEnter: (to, from, next) => { next(); }
		}
	]
});

// Nice way to explicitly check what's happening when router changes.
// router.beforeEach((to, from, next) => {
//   console.log('[router]   Routing from "' + from.path + '" to "' + to.path + '".');
//   next();
// });

const App = new Vue({
	store,
	router,
	i18n,
	data: () => {
		return {
			is_prepare_ready:   false
		};
	},
	computed: {
		...mapState({
			locale: state => state.i18n.locale
		})
	},
	created() {
		this.create();
	},
	methods: {
		translate,
		set_locale,
		create,
		resize
	},
	watch: {
		// '$route' (to, from) {
		//  console.log('[grid]   Switched from "' + from.path + '" to "' + to.path + '".');
		// },
		locale: function() {
			this.$i18n.locale = this.locale;
			// console.log('[grid]   locale has changed: ' + this.locale);
		}
	}
}).$mount('#app');


/**
 * This is where everything begins.
 * @protected
 */
function create() {
	// mosaikekkan
	console.log('[entries.grid.index] +++++++ create()');

	// Why using "utils.debounce"?
	// Every time screen size changes, it calls "resize()"
	// and we donnot want this to happen.
	// "utils.debounce" checks if the function is
	// being called consecutively within a certain time
	// and it limits the calls.
	window.addEventListener('resize', utils.debounce(this.resize, 400), false);

	this.set_locale(i18n.locale || 'en');
	this.resize();
	this.is_prepare_ready = true;
}


/**
 * Children components are using it. So, we pass it within our template.
 * @protected
 */
function translate(key, locale, values) {
	return this.$i18n.t(key, locale, values);
}


/**
 * Tells our i18n store that the locale changed.
 * Remember, "vue-i18n" does not have Vuex store support.
 * This is to inform our own i18n store for the change.
 * @protected
 */
function set_locale(locale) {
	this.$store.dispatch('set_locale', locale);
}


/**
 * @protected
 */
function resize() {
	// mosaikekkan
	console.log('[entries.grid.index] +++++++ resize()');
	this.$store.dispatch('set_screen_size');
}
