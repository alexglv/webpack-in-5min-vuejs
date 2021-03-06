/**
 * entries/sample/routes/wiki_store.js
 */
import Vue from 'vue';
import utils from '../../../lib/utils';

const path            = utils.path;
const Maybe            = utils.Maybe;

const timeout = 3000; // HTTP request

export default {
    state: {
        searching: false,
        list: []
    },
    // Mutations are triggered (usually) within this own module by "commit".
    mutations: {
        set_searching(state, bool) {
            state.searching = bool;
        },
        set_list(state, list = []) {
            state.list = list;
        }
    },
    // Actions are triggered from elsewhere via "dispatch".
    actions: {
        // This action is called from "entries/sample2.js":
        //    store.dispatch('wiki_search', text)
        // When triggered multiple times within 1000 msec,
        // it will debounce the event, meaning, only the last one
        // is captured and executed while the others are canceled.
        wiki_search: utils.debounce(
            wiki_search,
            1000
        ),
        // This action is called from "entries/sample2.js":
        //    store.dispatch('wiki_set_list', [])
        // in order to clear the input form for keywords.
        wiki_clear_list({state, dispatch, commit}) {
            commit('set_list', []);
        }
    }
};


/**
 * @protected
 * @param {Object} - Vuex store object
 * @param {string} list
 */
function wiki_search({state, dispatch, commit}, text = '') {
    if (utils.is_online() !== true) {
        console.warn('[entries.sample.routes.wiki_store]   no network');
        return;
    }
    if (state.searching === true) {
        console.log('[entries.sample.routes.wiki_store] searching...');
        return;
    }
    commit('set_searching', true);

    const on_retrieved = e => { console.log(e); };

    let options = {
        // headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        timeout,
        params: {
            action: 'query',
            list: 'search',
            format: 'json',
            srsearch: text,
            prop: 'links',
            callback: 'on_retrieved'
        }
    };
    const done = e => {
        if (e) { console.log(e); }
        commit('set_searching', false);
    };
    // mosaikkekan
    console.log('[entries.sample.routes.wiki_store]   options:', options);
    try {
        Vue.http.jsonp('https://en.wikipedia.org/w/api.php', options)
            .then(res => {
                res.json().then((data = {}, i) => {
                    // mosaikkekan
                    console.log('[entries.sample.routes.wiki_store]   data:', data);
                    // let { query = {} } = data || {};
                    // let { search = [] } = query;
                    let search = Maybe.of(data).map(path(['query','search'])).orElse([]).join();
                    let size = search.length;
                    // mosaikekkan
                    console.log('found ' + size + ' items');
                    if (size) {
                        let list = [];
                        search.forEach(item => {
                            let {pageid: id, title = ''} = item;
                            if (title) {
                                let id = 'item-' + i;
                                // mosaikekkan
                                console.log('  >>> ' + title);
                                let url = 'https://en.wikipedia.org/wiki/' + title;
                                list.push({ id, title, url });
                            }
                        });
                        if (list.length) {
                            commit('set_list', list);
                        }
                    }
                    done();
                }).catch(done);
            }, e => {
                console.warn(
                    '[entries.sample.routes.wiki_store]   err: ' + (e.statusText ? e.statusText : 'server error'));
                done(e);
            })
            .catch(done);
    }
    catch (e) {
        console.warn('[entries.sample.routes.wiki_store]   err: server has gone mad');
        done(e);
    }
}


