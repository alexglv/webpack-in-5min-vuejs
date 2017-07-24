/**
 * entries/sample/routes/webgl/components/topmenu.js
 */
import Vue from 'vue';
import template from './topmenu.html';

export default Vue.component(
	'topmenu',
	{
		props: {
			translate:		{ required: true, type: Function },
			set_locale:		{ required: true, type: Function },
			page:			{ required: false, type: String }
		},
		template
	}
);

