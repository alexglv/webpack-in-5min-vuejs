/**
 * lib/utils/maybe.js
 */

export default Maybe;

function Maybe(value) {
    this.__value = value;
};

Maybe.of = of;
Maybe.empty = empty;

const nothing_value = void 0;
const nothing = Maybe.nothing = of(nothing_value);

function of(value) {
    return new Maybe(value);
}

function empty() {
    return nothing;
}

Maybe.prototype.isNothing = function(){
    return (this.__value == null || this.__value === nothing_value);
};

Maybe.prototype.isJust = function(){
    return !this.isNothing();
};

Maybe.prototype.map = function(fn){
    // return this.isNothing() ? of(nothing) : of(fn(this.__value));
    return this.isNothing() ? this : of(fn(this.__value));
};

Maybe.prototype.join = function(){
    return this.__value;
};

Maybe.prototype.chain = function(fn){
    return this.map(fn).join();
};

Maybe.prototype.orElse = function(__default){
    return this.isNothing() ? Maybe.of(__default) : this;
};

Maybe.prototype.ap = function(another_maybe){
    return another_maybe.map(this.__value);
};

