/**
 * shared_store.js
 */
import utils from './lib/utils';

export default {
	state: {
		screen: {
			dpr:      1,
			width:    0,
			height:   0
		}
	},
	mutations: {
		set_screen(state, screen = null) {
			state.screen = Object.assign({}, state.screen, screen);
		}
	},
	actions: {
		set_screen_size
	}
};


/**
 * @protected
 * @param {Object} - Vuex store object
 */
function set_screen_size({state, dispatch, commit}) {
	commit('set_screen', {
		dpr:      window.devicePixelRatio,
		width:    window.innerWidth,
		height:   window.innerHeight
	});
}


