/**
 * entries/sample/index.js
 * This is the entry for "sample".
 */
import merge from 'lodash.merge';
import 'whatwg-fetch';
import Rx from 'rxjs/Rx';
import Vue from 'vue';
import Vuex from 'vuex';
import { mapState } from 'vuex';
import VueResource from 'vue-resource';
Vue.use(Vuex);
Vue.use(VueResource);

import utils from '../../lib/utils';
import store from './store';
import router from './router';
import i18n from './i18n';
import './style.styl';


/**
 * Child components will use this.
 * So need to pass this function as one of the props
 * whenever the child components want to use it.
 * No arrow function syntax for it will be bound to a specific scope.
 * @protected
 */
const translate = function(key, locale, values) {
	return this.$i18n.t(key, locale, values);
};


/**
 * Calling this method does NOT really change the locale for "vue-i18n".
 * It is only possible by watching "this.locale" (which is the project
 * managed i18n locale), and by explicitly telling "vue-i18n"
 * when detecting the "this.locale" changes.
 * This is also used by child components, and need to
 * pass it for child components to use it.
 * No arrow function syntax for it will be bound to a specific scope.
 * @protected
 */
const set_locale = function(locale = '') {
	this.$store.dispatch('set_locale', locale);
};


/**
 * No arrow function syntax for it will be bound to a specific scope.
 * @private
 */
const resize = function() {
	// mosaikekkan
	console.log('[entries.sample.index] +++++++ resize()');
	this.$store.dispatch('set_screen_size');
};


/**
 * When the project managed i18n locale changes,
 * then it tells "vue-i18" to change the actual locale.
 * (read the comments in "watch" section bellow)
 * No arrow function syntax for it will be bound to a specific scope.
 * @private
 */
const on_locale_change = function() {
	this.$i18n.locale = this.locale;
};


new Vue({
	store,   // referred as: "this.$store"
	router,  // referred as: "this.$router"
	i18n,    // referred as: "this.$i18n"
	data: () => {
		return {
			is_prepare_ready: false
		};
	},
	computed: {
		// Mapping all the store managed states.
		...mapState({
			// Although "locale" looks like the one managing
			// i18n states of the app, it is "vue-i18n"
			// actually doing the job...
			// This store managed "locale" is more like a proxy
			// used throughout the app to detect if the locale has changed.
			// When this sotre managed "locale" changes,
			// we detect the change by watching it changes,
			// and need to explicitly tell "vue-i18n" the locale has changed.
			// (look at the "watch" section bellow where we watch "locale")
			// "vue-i18n" needs to someday implement features
			// to asynchronously manage the locale state....
			locale: state => state.i18n.locale
		})
	},
	created() {

		// Although we want "resize()" to be called when screen size changes,
		// we also want to limit the calls otherwise it would slow the performance.
		// While I have "utils.debounce()" implemented which simply checks
		// if the given function is called consecutively within
		// a certain period of time, it is much easier to control it
		// using RxJS.

		// Using "utils.debounce()":
		// window.addEventListener('resize', utils.debounce(resize.bind(this), 1000), false);

		// Using "RxJS":
		Rx.Observable.fromEvent(window, 'resize')
			.debounceTime(1000)
			.subscribe(resize.bind(this));

		this.set_locale(i18n.locale || 'en');

		resize.call(this);

		this.is_prepare_ready = true;
	},
	methods: {
		translate,
		set_locale
	},
	watch: {

		// You can observe how the route changes (if you wish)
		//-----------------------------------------------------------------
		// '$route' (to, from) {
		//  console.log('[webgl]   Switched from "' + from.path + '" to "' + to.path + '".');
		// },
		//-----------------------------------------------------------------

		// This is extremely important and is absolutely necessary!!!!
		// By calling "set_locale()", it does NOT change the locale for "vue-i18n".
		// We can only do so by watching "this.locale" (which is managed
		// by project's i18n store), and explicitly tell "vue-i18n"
		// when detecting "this.locale" changed.
		locale: on_locale_change
	}

}).$mount('#app');


