'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _events = require('events');

var events = _interopRequireWildcard(_events);

/**
 * Pipeline processes a sequence of filters one by one
 * @param {string} key 
 * @param {*} value 
 * @param {array} work An array of filters to pass the key value through
 */

var Pipeline = (function () {
    function Pipeline(key, value, work) {
        _classCallCheck(this, Pipeline);

        this.key = key;
        this.value = value;
        this._work = work;
        this._events = new events.EventEmitter();
    }

    _createClass(Pipeline, [{
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
         * next processes the next filter in this pipeline.
         *
         * Next calls each filter with the following signature:
         * function(key, value, arg1..argn, pipeline)
         * Where arg1..argn represents any arguments the user supplied
         * when declaring the line spec. Pipeline refers to the current
         * instance.
         * @param {string} err 
         * @param {string} key
         * @param {*} value 
         */
    }, {
        key: 'next',
        value: function next(err, key, value) {

            var tmp;
            var f;
            var args = [];

            if (err) return this._events.emit('error', err, key, value);

            if (this._work.length === 0) return this._events.emit('success', key, value);

            tmp = this._work.shift();

            if (Array.isArray(tmp)) {
                f = tmp.shift();
                args = tmp;
            } else {
                f = tmp;
            }

            args.unshift(this);
            args.unshift(value);
            args.unshift(key);
            f.apply(null, args);
        }

        /**
         * run this pipeline
         */
    }, {
        key: 'run',
        value: function run() {
            this._events.emit('start');
            this.next(null, this.key, this.value);
        }
    }]);

    return Pipeline;
})();

Pipeline.create = function (key, value, flow, work) {
    return new Pipeline(key, value, flow, work);
};

exports['default'] = Pipeline;
module.exports = exports['default'];