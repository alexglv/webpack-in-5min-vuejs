/**
 * components/topmenu.js
 */
import Vue from 'vue';
import template from './topmenu.html';

export default Vue.component(
	'topmenu',
	{
		template,
		props: ['page'],
		computed: {
			is_grid_page() {
				return (this.page == 'grid') ? true : false;
			},
			is_wiki_page() {
				return (this.page == 'wiki') ? true : false;
			}
		}
	}
);

