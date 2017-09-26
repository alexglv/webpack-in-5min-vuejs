/**
 * lib/utils/monads/reader.js
 * From Jack Hsu's example:
 * https://raw.githubusercontent.com/jaysoo/example-functional-react/master/src/monads/Reader.js
 * His blog article is found at:
 * https://jaysoo.ca/2017/05/10/learn-fp-with-react-part-2/
 * Slightly modified (to make non-JS users a bit easier to read).
 */

const Reader = exec => {

    const map = f => {
        return Reader(ctx => f(exec(ctx)));
    };

    const contramap = f => {
        return Reader(ctx => exec(f(ctx)));
    };

    const chain = f => {
        return Reader(ctx => {
            const a = exec(ctx);
            return f(a).runReader(ctx);
        });
    };

    const ap = __reader => {
        return Reader(ctx => exec(ctx)(__reader.runReader(ctx)));
    };

    const run = ctx => exec(ctx);

    return {
        map,
        contramap,
        chain,
        ap,
        run
    };
};

/**
 * @public
 * @static
 */
Reader.of = x => Reader(() => x);

/**
 * @public
 * @static
 */
Reader.ask = () => Reader(x => x);

/**
 * @public
 * @static
 */
Reader.asks = f => Reader(f);


export default Reader;


