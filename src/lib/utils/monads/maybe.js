/**
 * lib/utils/monads/maybe.js
 * From James Sinclair's example (from his blog post):
 * https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/
 * Slightly modified to make it into a factory pattern (with self-chaining).
 */

const Maybe = value => {

    const empty = () => {
        return Maybe(void 0);
    };

    const isNothing = () => (value == null || value === void 0);

    const isJust = () => !isNothing();

    const map = f => {
        return isNothing() ? Maybe(void 0) : Maybe(f(value));
    };

    const orElse = __default => {
        return isNothing() ? Maybe(__default) : Maybe(value);
    };

    const join = () => value;

    const chain = f => {
        return map(f).join();
    };

    const ap = __maybe => {
        return __maybe.map(value);
    };

    return {
        empty,
        isNothing,
        isJust,
        map,
        orElse,
        join,
        chain,
        ap
    };
};

/**
 * @public
 * @static
 */
Maybe.of = o => Maybe(o);

export default Maybe;


