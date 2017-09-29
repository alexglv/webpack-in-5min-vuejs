/**
 * Standard tools that are regularly in use.
 *
 * LICENSES:
 *
 * For "sortBy" and "path" bellow, "Ramda" is licensed under MIT:
 * --------------------------------------------------------------------------
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2016 Scott Sauyet and Michael Hurley
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * --------------------------------------------------------------------------
 */
import merge from 'lodash.merge';
import mergewith from 'lodash.mergewith';
import seedrandom from 'seedrandom';

const srand = seedrandom();
const slice = Array.prototype.slice;

const concat = list => Array.prototype.concat.bind(list);

/**
 * From Eric Elliott's blog post.
 * https://medium.com/javascript-scene/a-functional-programmers-introduction-to-javascript-composing-software-d670d14ede30
 * -------------------------------------------------------------------
 * Alternatively, from his Gist:
 * https://gist.github.com/ericelliott/00d32233e855ef1903ba6a50b7d191d5
 * const curry = fn => (...args) => fn.bind(null, ...args);
 * -------------------------------------------------------------------
 * @public
 */
const curry = (fn, arr = []) => (
    (...args) => (
        a => (a.length === fn.length)
            ? fn(...a)
            : curry(fn, a)
    )([...arr, ...args])
);

/**
 * From Eric Elliott's blog post.
 * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
 * @public
 */
const compose = (...fns) => o => fns.reduceRight((v, f) => f(v), o);

/**
 * From Eric Elliott's Gist:
 * https://gist.github.com/ericelliott/00d32233e855ef1903ba6a50b7d191d5
 * or the same code found in his blog article:
 * https://medium.com/javascript-scene/functors-categories-61e031bac53f
 * -------------------------------------------------------------------
 * Alternatively, from his blog post:
 * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
 * const map = (fn, arr) => arr.reduce((acc, item, index, arr) => {
 *     return acc.concat(fn(item, index, arr));
 * }, []);
 * -------------------------------------------------------------------
 * @public
 */
const map = curry((fn, arr) => arr.map(fn));

/**
 * From Eric Elliott's Gist:
 * https://gist.github.com/ericelliott/00d32233e855ef1903ba6a50b7d191d5
 * -------------------------------------------------------------------
 * Alternatively, from his blog post:
 * https://medium.com/javascript-scene/higher-order-functions-composing-software-5365cf2cbe99
 * const filter = (
 *     fn, arr
 * ) => reduce((acc, curr) => fn(curr) ?
 *     acc.concat([curr]) :
 *     acc, [], arr
 * );
 * Or, from his another post:
 * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
 * const filter = (fn, arr) => arr.reduce((newArr, item) => {
 *   return fn(item) ? newArr.concat([item]) : newArr;
 * }, []);
 * -------------------------------------------------------------------
 * @public
 */
const filter = curry((fn, arr) => arr.filter(fn));

/**
 * Common way to implement "reduce".
 * -------------------------------------------------------------------
 * Alternatively, from Eric Elliott's blog post:
 * https://medium.com/javascript-scene/higher-order-functions-composing-software-5365cf2cbe99  
 * const reduce = (reducer, initial, arr) => {
 *     let acc = initial;
 *     for (let i = 0, length = arr.length; i < length; i++) {
 *         acc = reducer(acc, arr[i]);
 *     }
 *     return acc;
 * };
 * -------------------------------------------------------------------
 * @public
 */
const reduce = curry((fn, def, arr) => arr.reduce(fn, def));

/**
 * From "ramda" implementation.
 * https://github.com/ramda/ramda/blob/master/src/sortBy.js
 * (see the license information at the top of the file)
 * @public
 */
const sortBy = curry((fn, list) => {
    return Array.prototype.slice.call(list, 0).sort((a, b) => {
        const aa = fn(a);
        const bb = fn(b);
        return aa < bb ? -1 : aa > bb ? 1 : 0;
    });
});

/**
 * From Eric Elliott's Gist:
 * https://gist.github.com/ericelliott/00d32233e855ef1903ba6a50b7d191d5
 * @public
 */
const split = curry((splitOn, str) => str.split(splitOn));

/**
 * From Eric Elliott's Gist:
 * https://gist.github.com/ericelliott/00d32233e855ef1903ba6a50b7d191d5
 * @public
 */
const join = curry((str, arr) => arr.join(str));

/**
 * From Eric Elliott's example.
 * @public
 */
const pipe = fns => data => fns.reduce((prev, fn) => fn(prev), data);

/**
 * @public
 */
const prop = key => {
    if (typeof key != 'string') { throw new Error('Not a string'); }
    return o => (typeof o == 'object' && (key in o)) ? o[key] : null;
};

/**
 * From "ramda" implementation.
 * https://github.com/ramda/ramda/blob/master/src/path.js
 * (see the license information at the top of the file)
 * @public
 */
const path = curry((paths, o) => {
    let tmp = o;
    let i = 0;
    while (i < paths.length) {
        if (tmp == null) {
            return;
        }
        tmp = tmp[paths[i]];
        i += 1;
    }
    return tmp;
});

/**
 * @public
 */
const obj_keys_size = o => (typeof o == 'object' && o != null && Object.keys(o).length) || 0;

/**
 * http://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like#24048615
 * @public
 */
const is_array_like = item => {
    return Array.isArray(item) || (
        !!item
            && (typeof item == 'object')
            && item.hasOwnProperty('length')
            && (typeof item.length == 'number')
            && ((item.length == 0) || (
                (item.length > 0) && ((item.length - 1) in item)
            ))
    );
};

/**
 * https://davidwalsh.name/combining-js-arrays
 */
const merge_w = (obj, obj2) => (
    mergewith(obj, obj2, (o, o2) => (
        is_array_like(o)
            ? o2.reduce((acc, item) => acc.concat([item]), o.slice(0))
            : (typeof o == 'object')
            ? Object.assign(o, o2)
            : o
    ))
);

const promise_concat = f => x => f().then(concat(x));
const promise_reduce = (acc, x) => acc.then(promise_concat(x));
/*
 * Executes Promises sequentially.
 * https://stackoverflow.com/questions/24586110/resolve-promises-one-after-another-i-e-in-sequence#41115086
 */
const promise_serial = funcs => funcs.reduce(promise_reduce, Promise.resolve([]));

/**
 * http://stackoverflow.com/questions/38213668/promise-retry-design-patterns#38225011
 * @public
 */
const wait_for = (f, options = {}) => {
    return new Promise((resolve, reject) => {
        let {
            name = '', wait = 5000, interval = 100,
            wait_time_max = (1.5 * 60 * 1000),
            warn = false
        } = options;
        if (wait > wait_time_max) {
            wait = wait_time_max;
        }
        const max = Math.trunc(wait / interval);
        let elapsed = 0;
        const delay = () => new Promise((resolve, reject) => {
            if (warn && !(elapsed % 1000)) {
                const percent = Math.trunc((elapsed / wait) * 1000) / 10;
                console.log('[util]   '
                            + (name ? '(' + name + ')' : 'waiting')
                            + ' ' + elapsed + ' ms'
                            + ' (' + percent + '%)');
            }
            // (3) "2nd catch" run "setTimeout" to delay the "resolve".
            window.setTimeout(reject, interval);
        });
        const attempt = () => {
            if (f() !== true) {
                elapsed += interval;
                // (2) When "attempt" fails, throw an error
                //   to let it fall into the "2nd catch".
                throw new Error();
            }
            // (4) In case the "attempt" succeeds,
            //   then we should no longer return "reject".
            //   Since "p" does not have rejection,
            //   no matter how many times
            //   the "for" loop runs, it will not
            //   go to "1st catch" nor "2nd catch".
            //   When the loop ends, it goes to "then".
            //   Otherwise, it goes to the "3rd catch".
            return elapsed;
        };
        // (1) In order to run the initial "attempt",
        //   we must intentionally let it
        //   fall into the "1st catch".
        let p = Promise.reject();
        for (let i=0; i<max; i++) {
            p = p.catch(attempt).catch(delay);
        }
        p = p.then(resolve).catch(() => {
            reject(new Error(
                'Gave up waiting'
                    + (name ? ' for "' + name + '"' : '')
            ));
        });
    });
};

/**
 * @public
 */
const debounce = (fn, wait, context = this) => {
    let timeout = null;
    let args = null;
    const fn2 = () => { fn.apply(context, args); };
    return function() {
        args = arguments;
        window.clearTimeout(timeout);
        timeout = window.setTimeout(fn2, wait);
    };
};


/**
 * @public
 */
const random = (min = 0, max = 1) => {
    return Math.floor(srand() * (max - min + 1)) + min;
};

/**
 * Randomly generate strings of 4.
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#105074
 * Steps:
 *   1. random from 1 to 65536
 *   2. to hex
 *   3. rid the head
 * @public
 */
const s4 = () => (
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
);

/**
 * @public
 */
const generate_serial_id = slot => {
    if (typeof slot !== 'number') { slot = 4; }
    var id = '';
    for (var i=0; i<slot; i++) { id += s4(); }
    return id;
};

/**
 * https://www.electrictoolbox.com/pad-number-zeroes-javascript-improved/
 * @public
 */
const pad = (num = 0, size = 2) => {
    var s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
};

/**
 * @public
 */
const mysql_date = (d = null) => {
    return (d && d.getFullYear()
     + '-' + pad(d.getMonth() + 1)
     + '-' + pad(d.getDate())
     + ' ' + pad(d.getHours())
     + ':' + pad(d.getMinutes())
     + ':' + pad(d.getSeconds())
           ) || null;
};

/**
 * @public
 */
const mysql_datetime = (d = new Date) => (
    (d && d.getFullYear()
     + '-' + pad(d.getMonth() + 1)
     + '-' + pad(d.getDate())
     + ' ' + pad(d.getHours())
     + ':' + pad(d.getMinutes())
     + ':' + pad(d.getSeconds())
    ) || null
);

/**
 * @public
 */
const document_ready = () => {
    return new Promise((resolve, reject) => {
        let state = document.readyState;
        if (state == 'interactive' || state == 'complete') {
            resolve();
        } else {
            window.addEventListener('DOMContentLoaded', resolve);
        }
    });
};

/**
 * @public
 */
const is_online = () => {
    return (typeof window.navigator != 'undefined' && window.navigator.onLine)
        ? true : false;
};

/**
 * Ex. 16733683 ---> ff55f3
 * @public
 * @param {number} num
 * @returns {string}
 */
function num_to_hex(num = 0) {
    return (typeof num == 'number') ? num.toString(16) : '000000';
}

/**
 * Ex. 16733683 ---> #ff55f3
 * @public
 * @param {number} num
 * @returns {string}
 */
function num_to_css_hex(num = 0) {
    let hex = num_to_hex(num);
    // make sure being padded
    return hex ? '#' + ('00000' + hex).substr(-6) : '';
}

/**
 * Ex. ff55f3 ---> 16733683
 * @public
 * @param {string} hex
 * @returns {number}
 */
function hex_to_num(hex = '') {
    return (typeof hex == 'number') ? hex
        : (typeof hex == 'string' && hex[0] == '#')
        ? parseInt(hex.slice(1), 16) : 0;
}

/**
 * Ex. {r: 255, g: 85, b: 243} ---> 16733683
 * @public
 * @param {Object} rgb
 * @returns {number}
 */
function rgb_to_num(rgb = {}) {
    let { r = 0, g = 0, b = 0 } = rgb;
    return r << 16 | g << 8 | b;
}

/**
 * Ex. {r: 255, g: 85, b: 243} ---> ff55f3
 * @public
 * @param {Object} rgb
 * @returns {string}
 */
function rgb_to_hex(rgb = {}) {
    return num_to_hex( rgb_to_num(rgb) );
}

/**
 * Ex. {r: 255, g: 85, b: 243} ---> #ff55f3
 * @public
 * @param {Object} rgb
 * @returns {string}
 */
function rgb_to_css_hex(rgb = {}) {
    return num_to_css_hex( rgb_to_num(rgb) );
}

/**
 * Ex. ff55f3 ---> {r: 255, g: 85, b: 243}
 * @public
 * @param {string} hex
 * @returns {Object}
 */
function hex_to_rgb(hex = '') {
    let r = 0, g = 0, b = 0;
    if (typeof hex == 'string') {
        if (hex[0] == '#') { hex = hex.splice(1); } // chop "#" if any
        r = hex >> 16 && 0xff;
        g = hex >> 8 && 0xff;
        b = hex && 0xff;
    }
    return { r, g, b };
}

/**
 * Ex. 16733683 ---> {r: 255, g: 85, b: 243}
 * @public
 * @param {number} num
 * @returns {Object}
 */
function num_to_rgb(num = 0) {
    return hex_to_rgb( num_to_hex(num) );
}

/**
 * Ex. {r: 255, g: 85, b: 243} ---> "rgb(255, 85, 243)"
 * @public
 * @param {Object} rgb
 * @returns {string}
 */
function rgb_to_rgb_syntax(rgb = {}, alpha) {
    let { r = 0, g = 0, b = 0 } = rgb;
    return (typeof alpha == 'number')
        ? 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
        : 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

/**
 * Ex. 16733683 ---> rgb(255, 85, 243)
 * @public
 * @param {number} num
 * @returns {string}
 */
function num_to_rgb_syntax(num = 0, alpha) {
    return rgb_to_rgb_syntax( num_to_rgb(num), alpha );
}

/**
 * Ex. ff55f3 ---> rgb(255, 85, 243)
 * @public
 * @param {string} hex
 * @returns {string}
 */
function hex_to_rgb_syntax(hex = '', alpha) {
    return rgb_to_rgb_syntax( hex_to_rgb(hex), alpha );
}

/**
 * Ex. rgb(255, 85, 243) ---> {r: 255, g: 85, b: 243}
 * @public
 * @param {string} hex
 * @returns {string}
 */
function rgb_syntax_to_rgb(syntax = '') {
    let exp = /rgb\((\d+), (\d+), (\d+)\)/;
    let m = syntax.match(exp);
    return m ? {
        r: parseInt(m[1]),
        g: parseInt(m[2]),
        b: parseInt(m[3])
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Ex. rgb(255, 85, 243) ---> #ff55f3
 * @public
 * @param {string} hex
 * @returns {string}
 */
function rgb_syntax_to_css_hex(syntax = '') {
    return rgb_to_css_hex( rgb_syntax_to_rgb(syntax) );
}

const jp_num_units = ['万','億','兆','京','垓','杼','穰','溝','澗','正','載','極','恒河沙','阿僧祇','那由他','不可思議','無量大数'];

/**
 * http://www.openspc2.org/reibun/javascript2/calc/japanese/0005/index.html
 * @public
 */
const num_to_jp_unit = num => {
    let str = '' + num;
    let res = '';
    let cnt = 0;
    let index = 0;
    let size = str.length - 1;
    for (let i=size; i>=0; i--) {
        res = str.charAt(i) + res;
        cnt++;
        if (((cnt % 4) == 0) && (i != 0)) {
            res = jp_num_units[index++] + res;
        }
    }
    res = res.replace(new RegExp('0000'), '');
    return res;
};


export default Object.freeze({
    slice,
    concat,
    curry,
    compose,
    map,
    filter,
    reduce,
    sortBy,
    split,
    join,
    pipe,
    prop,
    path,
    obj_keys_size,
    is_array_like,
    merge_w,
    promise_serial,
    wait_for,
    debounce,
    random,
    s4,
    generate_serial_id,
    pad,
    mysql_date,
    mysql_datetime,
    document_ready,
    is_online,
    num_to_hex,
    num_to_css_hex,
    hex_to_num,
    rgb_to_num,
    rgb_to_hex,
    rgb_to_css_hex,
    hex_to_rgb,
    num_to_rgb,
    rgb_to_rgb_syntax,
    num_to_rgb_syntax,
    hex_to_rgb_syntax,
    rgb_syntax_to_rgb,
    rgb_syntax_to_css_hex,
    num_to_jp_unit
});


