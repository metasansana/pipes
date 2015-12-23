'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _WorkBuilder = require('./WorkBuilder');

var _WorkBuilder2 = _interopRequireDefault(_WorkBuilder);

var _Flow = require('./Flow');

var _Flow2 = _interopRequireDefault(_Flow);

/**
 * @typedef {object} Filters
 * @property {array} ['?']
 * @property {array} ['*']
 * @property {array} ['@after']
 */

/**
 * Pipe is the main entry point of this library.
 *
 * A Pipe acts as a set of filters that can be used to transform
 * or simply validate the keys of an object.
 *
 * It takes a Filters as it's only constructor argument
 * which specifies the work to be done on each key.
 *
 * A Filters is simply a javascript object that may look like this:
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
 * @param {Filters} spec 
 * @param {object} builtins 
 */

var Pipe = (function () {
    function Pipe(spec, builtins) {
        _classCallCheck(this, Pipe);

        this._spec = spec;
        this._builtins = builtins;
        this._events = Object.create(null);
    }

    /**
     * on queues up a callback to be called when an event occurs
     * @param {string} event 
     * @param {function} cb 
     */

    _createClass(Pipe, [{
        key: 'on',
        value: function on(event, cb) {
            this._events[event] = this._events[event] || [];
            if (this._events[event].indexOf(cb) < 0) this._events[event].push(cb);
            return this;
        }

        /**
         * emit broadcasts an event to interested listeners
         * @param {string} evt 
         * @param {...*} args
         */
    }, {
        key: 'emit',
        value: function emit(evt) {
            var _arguments = arguments;

            if (Array.isArray(this._events[evt])) this._events[evt].slice().forEach(function (f) {
                return f.apply(null, Array.prototype.splice.call(_arguments, 1));
            });
        }

        /**
         * run starts the pipe lines based on the internal spec
         */
    }, {
        key: 'run',
        value: function run(o, cb) {

            var builder = new _WorkBuilder2['default'](this._spec, o, this._builtins);
            var work;
            var flow;

            work = builder.build();
            flow = new _Flow2['default'](work, o, this, this._spec['@after'] || null);
            this.on('done', cb);
            flow.run();
        }
    }]);

    return Pipe;
})();

exports['default'] = Pipe;
module.exports = exports['default'];