/**
 * pages/wiki/wiki.js
 */
import Vue from 'vue';
import {mapState} from 'vuex';
import store from '../../store.js';
import config from 'config';
import utils from '../../lib/utils.js';
import template from './wiki.html';
import topmenu from '../../parts/topmenu/topmenu.js';

// Routing definition for "/wiki"
export default {
	data: () => {
		return {
			// <input v-model="keywords" />
			keywords: ''
		};
	},
	// Similar to "this.data" but it provides you computed data.
	computed: {
		// We can map whatever the states defined in the "store".
		...mapState({
			is_searching: state => state.wiki.searching,
			search_result_list: state => state.wiki.list
		})
	},
	// Our template:
	//    ../../wiki.html
	template,
	components: {
		topmenu
	},
	beforeRouteEnter (to, from, next) {
		window.setTimeout(() => {
			document.getElementById('keywords').focus();
		}, 400);
		// Need to call "next()" to resolve the transition.
		next();
	},
	watch: {
		// Watch for any changes on "keywords".
		keywords: text => {
			// When we have the keyword to search, we tell Vuex's "store" module to
			// search for the keyword using Media Wiki API Search via "dispatch".
			store.dispatch('wiki_search', text);
			// Also, we want to clear the input form.
			store.dispatch('wiki_clear_list');
		}
	},
	methods: {
	}
};

