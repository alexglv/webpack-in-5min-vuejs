/**
 * lib.utils
 */
import seedrandom from 'seedrandom';

const srand = seedrandom();
const slice = Array.prototype.slice;

export default Object.freeze({
	is_array_like,
	document_ready,
	is_online,
	random,
	s4,
	generate_serial_id,
	json_encode,
	json_decode,
	wait_for,
	debounce
});


/**
 * @public
 * http://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like#24048615
 */
function is_array_like(item) {
	return (
		Array.isArray(item) || 
		(!!item &&
		  typeof item === "object" &&
		  item.hasOwnProperty("length") && 
		  typeof item.length === "number" && 
		  item.length > 0 && 
		  (item.length - 1) in item
		)
	);
}

/**
 * @public
 */
function document_ready() {
	return new Promise((resolve, reject) => {
		let state = document.readyState;
		if (state == 'interactive' || state == 'complete') {
			resolve();
		} else {
			window.addEventListener('DOMContentLoaded', resolve);
		}
	});
}

/**
 * @public
 */
function is_online() {
	return (typeof window.navigator != 'undefined' && window.navigator.onLine)
		? true : false;
}

/**
 * @public
 */
function random(min = 0, max = 1) {
	return Math.floor(srand() * (max - min + 1)) + min;
}

/**
 * Randomly generate strings of 4.
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#105074
 * Steps:
 *   1. random from 1 to 65536
 *   2. to hex
 *   3. rid the head
 * @public
 */
function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

/**
 * @public
 */
function generate_serial_id(slot) {
	if (typeof slot !== 'number') { slot = 4; }
	var id = '';
	for (var i=0; i<slot; i++) { id += s4(); }
	return id;
}

/**
 * @public
 */
function json_encode(data) {
	return new Promise((resolve, reject) => {
		if (!data) {
			reject(new Error('No data is given.'));
			return;
		}
		try {
			resolve( JSON.stringify(data) );
		}
		catch(e) {
			reject(e);
		}
	});
}

/**
 * @public
 */
function json_decode(data) {
	return new Promise((resolve, reject) => {
		if (!data) {
			reject(new Error('No data is given.'));
			return;
		}
		try {
			resolve( JSON.parse(data) );
		}
		catch(e) {
			reject(e);
		}
	});
}

/**
 * http://stackoverflow.com/questions/38213668/promise-retry-design-patterns#38225011
 * @public
 */
function wait_for(fn = null, {name = '', wait = 4000, interval = 100}) {
	let elapsed = 0;
	let max = parseInt(wait / interval);
	if (max > 150) { max = 150; } // No more than 15 sec.

	return new Promise((resolve, reject) => {
		let p = Promise.reject();
		for (let i=0; i < max; i++) {
			p = p.catch(() => {
				if (fn() !== true) {
					elapsed += interval;
					let msg = (i + 1) >= max
							? ('waited for ' + elapsed + ' msec')
							: 'not true';
					if (name) {
						msg += ' (for "' + name + '")';
					}
					throw new Error(msg);
				}
				return;
			}).catch(e => {
				return new Promise((_res, _rej) => {
					window.setTimeout(_rej.bind(null, e), interval); 
				});
			});
		}
		p = p.then(__done).catch(e => { __done(e); });

		/**
		 * @private
		 */
		function __done(err) {
			if (err) { reject(err); }
			else {
				resolve();
			}
			fn = name = wait = interval = elapsed = max =
				resolve = reject = p = void 0;
		}
	});
}

/**
 * @public
 */
function debounce(fn, wait, context = this) {
	let timeout = null;
	let args = null;
	const fn2 = () => { fn.apply(context, args); };
	return function() {
		args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(fn2, wait);
	};
}


