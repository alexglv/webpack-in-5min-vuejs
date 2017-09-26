/**
 * entries/sample/routes/wiki.js
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import {mapState} from 'vuex';

import config from '../config';
import utils from '../../../lib/utils';
import template from './wiki.html';
import topmenu from './components/topmenu.js';

export default {
    data: () => {
        return {
            keywords: ''
        };
    },
    props: {
        translate:            { required: true, type: Function },
        set_locale:            { required: true, type: Function }
    },
    computed: {
        ...mapState({
            screen: state => state.share.screen,
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
        window.setTimeout(() => { // set focus on the imput form
            document.getElementById('keywords').focus();
        }, 400);
        next(vm => {}); // make sure to resolve the route transition
    },
    watch: {
        // Watch "keywords" changes.
        keywords: function(text) {
            // Any words given, perform Wiki API Search.
            // (by dispatching the command to "wiki_store.js")
            this.$store.dispatch('wiki_search', text);
            this.$store.dispatch('wiki_clear_list');
        }
    }
};

