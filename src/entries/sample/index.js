/**
 * entries/sample/index.js
 * This is the entry for "sample".
 */
import merge from 'lodash.merge';
import 'whatwg-fetch';
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

const App = new Vue({
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
		// Why using "utils.debounce"?
		// Because we do NOT want to call "resize()"
		// every time the screen size changes.
		// "utils.debounce" checks if the function specified
		// is called consequently within the certain period of time,
		// and limit its calls.
		window.addEventListener('resize', utils.debounce(this.resize, 400), false);

		this.set_locale(i18n.locale || 'en');
		this.resize();
		this.is_prepare_ready = true;
	},
	methods: {
		translate,
		set_locale,
		resize
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
		locale: function() {
			this.$i18n.locale = this.locale;
		}
	}
}).$mount('#app');


/**
 * Child components will use this.
 * So need to pass this function as one of the props
 * whenever the child components want to use it.
 * @protected
 */
function translate(key, locale, values) {
	return this.$i18n.t(key, locale, values);
}


/**
 * Calling this method does NOT really change the locale for "vue-i18n".
 * It is only possible by watching "this.locale" (which is the project
 * managed i18n locale), and by explicitly telling "vue-i18n"
 * when detecting the "this.locale" changes.
 * This is also used by child components, and need to
 * pass it for child components to use it.
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
	console.log('[entries.sample.index] +++++++ resize()');
	this.$store.dispatch('set_screen_size');
}


