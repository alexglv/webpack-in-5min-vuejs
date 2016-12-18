/**
 * pages.sidemenu
 */
import Vue from 'vue';
import template from '../../sidemenu.html';

export default Vue.component(
	'sidemenu',
	{
		props: ['page'],
		template,
		computed: {
			is_main_page() {
				return (this.page == 'main') ? true : false;
			},
			is_wiki_page() {
				return (this.page == 'wiki') ? true : false;
			}
		}
	}
);

