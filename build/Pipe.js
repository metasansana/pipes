'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _FlowManager = require('./FlowManager');

var _FlowManager2 = _interopRequireDefault(_FlowManager);

var _Specification = require('./Specification');

var _Specification2 = _interopRequireDefault(_Specification);

var _builtins = require('./builtins');

var builtins = _interopRequireWildcard(_builtins);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var combine = function combine(pipe, filters) {
    for (var key in filters) pipe.addFilter(key, filters[key]);
};

/**
 * @typedef {function} Filter
 * @param {string} key The key of the property being filtered.
 * @param {*} value The value of the property being filtered.
 * @param {Pipeline} line The current pipeline being processed.
 * @param {...*} args Various arguments passed to the filter by the spec
 */

/**
 * Pipe is the main entry point of this library.
 *
 * A Pipe acts as a set of filters that can be used to transform
 * or simply validate the keys of an object.
 *
 * It takes a Specification as it's only constructor argument
 * which specifies the work to be done on each key.
 *
 * @param {object} spec 
 * @param {object} [passedBuiltins] 
 */

var Pipe = (function () {
    function Pipe(spec, passedBuiltins) {
        _classCallCheck(this, Pipe);

        this._spec = spec;
        this._builtins = Object.create(null);
        this._events = new _events2['default'].EventEmitter();

        combine(this, builtins);
        if (passedBuiltins) combine(this, passedBuiltins);
    }

    _createClass(Pipe, [{
        key: 'on',
        value: function on() {
            this._events.on.apply(this._events, arguments);
            return this;
        }
    }, {
        key: 'once',
        value: function once() {
            this._events.once.apply(this._events, arguments);
            return this;
        }

        /**
         * addFilter adds a filter, transform, validator etc to the list
         * so it can be referenced by name.
         * @param {string} key 
         * @param {Filter} f 
         * @returns {Pipe}
         */
    }, {
        key: 'addFilter',
        value: function addFilter(key, f) {
            this._builtins[key] = f;
            return this;
        }

        /**
         * run starts the pipe lines based on the internal spec
         */
    }, {
        key: 'run',
        value: function run(o, cb, $this) {
            var manager = new _FlowManager2['default'](new _Specification2['default'](this._spec, o, this._builtins), this._events);
            this.once('error', function (err, o) {
                return cb(err, o);
            });
            this.once('success', function (o) {
                return cb(null, o);
            });
            this._events.emit('start');
            manager.run(o, $this);
        }
    }]);

    return Pipe;
})();

exports['default'] = Pipe;
module.exports = exports['default'];