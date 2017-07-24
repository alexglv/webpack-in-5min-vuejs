/**
 * entries/sample/routes/wiki.js
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import {mapState} from 'vuex';

import config_0 from 'config';
import config_1 from '../config';
import utils from '../../../lib/utils';
import template from './wiki.html';
import topmenu from './components/topmenu.js';

const assign		= merge;
const path			= utils.path;
const Maybe			= utils.Maybe;

const config = assign({}, config_0, config_1);

export default {
	data: () => {
		return {
			keywords: ''
		};
	},
	props: {
		translate:			{ required: true, type: Function },
		set_locale:			{ required: true, type: Function }
	},
	computed: {
		...mapState({
			screen: state => state.shared.screen,
			locale: state => state.i18n.locale,
			is_searching: state => state.wiki.searching,
			search_result_list: state => state.wiki.list
		})
	},
	template,
	components: {
		topmenu
	},
	beforeRouteEnter (to, from, next) {
		// Focus on the input form.
		window.setTimeout(() => {
			document.getElementById('keywords').focus();
		}, 400);
		// Need to resolve the transition.
		next(vm => {});
	},
	// beforeRouteUpdate (to, from, next) {
	//   next(vm => {});
	// },
	watch: {
		// Watch for changes on "keywords" input form.
		keywords: function(text) {
			// When we have the keyword given, we dispatch an action
			// defined in "wiki_store.js" to perform a search
			// using "Wiki API Search".
			this.$store.dispatch('wiki_search', text);
			this.$store.dispatch('wiki_clear_list');
		}
	},
	methods: {
	}
};

