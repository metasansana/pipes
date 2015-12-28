'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var passthrough = function passthrough(key, value, line) {
    line.next(null, key, value);
};
var invalid = function invalid(key, value, line) {
    line.next(new Error(key + ' is invalid!'));
};
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

var Specification = (function () {
    function Specification(spec, o, builtins) {
        _classCallCheck(this, Specification);

        this.spec = spec;
        this.o = o;
        this.builtins = builtins;
    }

    _createClass(Specification, [{
        key: '_substitute',
        value: function _substitute(line, builtins, key) {

            var filter;

            if (!line) return line;

            line = typeof line === 'string' ? [line] : line;

            for (var i = 0; i < line.length; i++) {

                filter = line[i];
                if (typeof filter === 'function') {
                    return line;
                } else if (this.builtins[filter]) {
                    line[i] = this.builtins[filter];
                } else if (Array.isArray(filter)) {
                    if (typeof filter[0] === 'string') filter[0] = this.builtins[filter[0]];
                } else {
                    throw new Error('Invalid filter supplied \'' + filter + '\' at key \'' + key + '\'!');
                }

                return line;
            }
        }

        /**
         * get the work for this key
         * @param {string} key
         */
    }, {
        key: 'get',
        value: function get(key) {

            var work = [];

            if (Specification.KEYWORDS.indexOf(key) > -1) {
                work = null;
            } else {

                if (this.spec[key]) {
                    work.push.apply(work, this.spec[key]);
                } else {
                    work.push.apply(work, this.unknown());
                }

                work.push.apply(work, this.all());

                if (work.length === 0) work = null;
            }

            return this._substitute(work, this.builtins, key);
        }

        /**
         * unknown returns a list of filters for handling
         * unknown properties
         */
    }, {
        key: 'unknown',
        value: function unknown() {
            if (Array.isArray(this.spec['?'])) return this.spec['?'];
            return [passthrough];
        }

        /**
         * all returns a list of filters that all keys must be passed through
         */
    }, {
        key: 'all',
        value: function all() {
            if (Array.isArray(this.spec['*'])) return this.spec['*'];
            return [passthrough];
        }

        /**
         * after returns the @after list of filters
         */
    }, {
        key: 'after',
        value: function after() {
            if (Array.isArray(this.spec['@after'])) return this.spec['@after'];
            return [passthrough];
        }

        /**
         * array returns the list of keys that must be arrays
         */
    }, {
        key: 'array',
        value: function array() {
            if (this.spec['@array']) return this.spec['@array'];
            return [];
        }

        /**
         * keys returns an array of all the keys to that will be passed
         * through the filters.
         * @returns {array}
         */
    }, {
        key: 'keys',
        value: function keys() {
            return Object.keys(this.o).concat(this.userKeys()).filter(function (key, index, array) {
                return array.indexOf(key) === index;
            });
        }

        /**
         * userKeys returns an array of non-keyword keys
         */
    }, {
        key: 'userKeys',
        value: function userKeys() {
            return Object.keys(this.spec).filter(function (k) {
                return Specification.KEYWORDS.indexOf(k) < 0;
            });
        }
    }]);

    return Specification;
})();

Specification.KEYWORDS = ['@after', '@array', '?', '*', '!'];
exports['default'] = Specification;
module.exports = exports['default'];