var passthrough = [(key, value, line) => {
    line.next(null, key, value);
}];
var reject = [(key, value, line) => {
    line.next(null, key, null);
}];
var invalid = [(key, value, line) => {
    line.next(new Error(`${key} is invalid!`));
}];
var slice = a => Array.isArray(a) ? a.slice() : a;
/**
 * Specification wraps around the user supplied spec to
 * make handling it easier.
 *
 * {
 *    id: [[number],[max, 10]],
 *    created_by: [[exist, 'users', 'id']],
 *    '?': [['stringify']],
 *    '*': [['shorten, 12]],
 *    '@after': [timestamp]
 * }
 *
 * In the above spec, we pass the 'id' and 'created_by' fields through 
 * the filters we have defined. In this case, the filters are passed
 * as functions (number, max, exist); in each array,
 * the first key indicates the filter to be called and the remaining
 * members are treated as arguments.
 *
 * The '?', '*' and '@after' are special keywords that indicate:
 *
 * '?' -> Pass any unknown keys through this pipeline
 * '*' -> Pass all keys through this pipeline when finished
 * '@after' -> The final object is passed through this pipeline ONLY if there
 *             are no errors
 * 
 * @param {object} spec 
 * @param {object} o 
 * @param {object} builtins
 */
class Specification {

    constructor(spec, o, builtins) {
        this.spec = spec;
        this.o = o;
        this.builtins = builtins;
    }

    _substitute(line, builtins, key) {

        var filter;

        if (!line) return line;

        line = (typeof line === 'string') ? [line] : line;

        for (var i = 0; i < line.length; i++) {
            filter = line[i];
            if (typeof filter === 'function') {
                return line;
            } else if (this.builtins[filter]) {
                line[i] = this.builtins[filter];
            } else if (Array.isArray(filter)) {
                if (typeof filter[0] === 'string') {
                    if (!this.builtins[filter[0]])
                        throw new Error(`${filter[0]} is not a known filter!`);
                    filter[0] = this.builtins[filter[0]]
                }
            } else {
                throw new Error(`Invalid filter supplied '${filter}' at key '${key}'!`);
            }
        }

        return line;
    }

    /**
     * get the work for this key
     * @param {string} key
     */
    get(key) {

        var work = [];

        if (Specification.KEYWORDS.indexOf(key) > -1) {
            work = null;
        } else if ((!this.o[key]) &&
            (Array.isArray(this.o['@optional'])) && (this.o['@optional'].indexOf(key > -1))) {
                work = null;
            } else {

                if (this.spec[key]) {
                    work.push.apply(work, slice(this.spec[key]));
                } else {
                    work.push.apply(work, this.unknown());
                }

                work.push.apply(work, this.all());

                if (work.length === 0)
                    work = null;
            }
            return this._substitute(work, this.builtins, key);

        }

        /**
         * unknown returns a list of filters for handling
         * unknown properties
         */
        unknown() {
            if (Array.isArray(this.spec['?'])) return this.spec['?'];
            return reject;
        }

        /**
         * all returns a list of filters that all keys must be passed through
         */
        all() {
            if (Array.isArray(this.spec['*'])) return this.spec['*'];
            return passthrough;
        }

        /**
         * after returns the @after list of filters
         */
        after() {
            if (Array.isArray(this.spec['@after'])) return this.spec['@after'];
            return passthrough;
        }

        /**
         * array returns the list of keys that must be arrays
         */
        array() {
            if (this.spec['@array']) return this.spec['@array'];
            return [];
        }

        /**
         * keys returns an array of all the keys that will be passed
         * through the filters.
         * @returns {array}
         */
        keys() {
            return Object.keys(this.o).
            concat(this.userKeys()).
            filter((key, index, array) => (array.indexOf(key) === index));
        }

        /**
         * userKeys returns an array of non-keyword keys
         */
        userKeys() {
            return Object.keys(this.spec).
            filter(k => Specification.KEYWORDS.indexOf(k) < 0);
        }

    }

    Specification.KEYWORDS = ['@after', '@array', '?', '*', '!', '@nullable'];
    export default Specification
