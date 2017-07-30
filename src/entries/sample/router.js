/**
 * entries/sample/router.js
 * "sample" entry uses "vue-router".
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import route_to_webgl from './routes/webgl';
import route_to_wiki from './routes/wiki';

// Sometimes you want "/" instead of "#":
//
//    http://localhost:8080/sample.html/webgl
//    http://localhost:8080/sample.html/wiki
//
// then set router "mode" to "history":
//
//    {
//       mode: 'history',
//    }
//
// more details are discussed in  README...
//
const router = new VueRouter({
	base: '/',
	routes: [
		{ path: '/', redirect: '/webgl' },
		{
			name: 'webgl',
			path: '/webgl',
			component: route_to_webgl
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

// When you need to find out how your pages are routed:
//----------------------------------------------------------
// router.beforeEach((to, from, next) => {
//   console.log('[router]   Routing from "' + from.path + '" to "' + to.path + '".');
//   next();
// });
//----------------------------------------------------------

module.exports = router;

