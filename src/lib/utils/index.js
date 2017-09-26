/**
 * lib/utils/index.js
 */
import core from './core';
import Maybe from './maybe';

const curry   = core.curry;
const prop    = core.prop;
const path    = core.path;

const maybe_get_children = (src, o) => Maybe.of(src).map(
    typeof o == 'string' ? prop(o) : path(o)
);

const extract_i18n = curry((locale, fallback, o) => (
    Maybe.of(o)
        .map(prop(locale))
        .orElse(Maybe.of(o).chain(prop(fallback)))
        .orElse('')
        .join()
));

/**
 * @public
 */
const mysql_year = (d = null) => (
    core.mysql_date(d).slice(0, 4).split('-').join('')
);

/**
 * http://stackoverflow.com/questions/1480133/how-can-i-get-an-objects-absolute-position-on-the-page-in-javascript#1480137
 * @public
 */
const get_element_commulative_offset = el => {
    let top   = 0;
    let left  = 0;
    while (el) {
        top   += el.offsetTop  || 0;
        left  += el.offsetLeft || 0;
        el    = el.offsetParent;
    }
    return { top, left };
};

export default {
    ...core,
    Maybe,
    maybe_get_children,
    extract_i18n,
    mysql_year,
    get_element_commulative_offset
};

