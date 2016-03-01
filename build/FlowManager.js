'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Pipeline = require('./Pipeline');

var _Pipeline2 = _interopRequireDefault(_Pipeline);

var _PipeError = require('./PipeError');

var _PipeError2 = _interopRequireDefault(_PipeError);

var _PipingFactory = require('./PipingFactory');

var _PipingFactory2 = _interopRequireDefault(_PipingFactory);

/**
 * FlowManager manages the actual 'flowing' of the target object keys
 * into the various pipe lines.
 * @param {Specification} spec 
 * @param {object} o 
 * @param {EventSource} pipe
 */

var FlowManager = (function () {
    function FlowManager(spec, pipe) {
        _classCallCheck(this, FlowManager);

        this._spec = spec;
        this._pipe = pipe;
        this._errors = Object.create(null);
        this._errorCount = 0;
        this._filtered = Object.create(null);
        this._count = 0;
    }

    /**
     * error is called when an error occurs
     * @param {Error} err 
     * @param {string} key 
     * @param {*} value 
     */

    _createClass(FlowManager, [{
        key: 'error',
        value: function error(err, key, value) {
            this._count = this._count - 1;
            this._errors[key] = err.message;
            this._errorCount = this._errorCount + 1;
            this.finish();
        }

        /**
         * success 
         * @param {string} key 
         * @param {*} value 
         */
    }, {
        key: 'success',
        value: function success(key, value) {

            this._count = this._count - 1;

            if (value !== null && value !== undefined) this._filtered[key] = value;

            this.finish();
        }

        /**
         * finish
         */
    }, {
        key: 'finish',
        value: function finish() {
            var _this = this;

            if (this._count !== 0) return;

            if (this._errorCount > 0) return this._pipe.emit('error', new _PipeError2['default'](this._errors, this._errorCount), this._filtered);

            _Pipeline2['default'].create('@after', this._filtered, this._spec.after()).on('error', function (err, key, value) {
                return _this._pipe.emit('error', new _PipeError2['default']({
                    '@after': err
                }, 1));
            }).on('success', function () {
                return _this._pipe.emit('success', _this._filtered);
            }).run();
        }
    }, {
        key: 'run',
        value: function run(o, $this) {
            var _this2 = this;

            var factory = new _PipingFactory2['default'](this, this._spec);
            var runs = this._spec.keys();
            this._count = runs.length;
            runs.forEach(function (k) {
                return factory.create(k, o[k], _this2._spec.spec[k], $this);
            });
        }
    }]);

    return FlowManager;
})();

exports['default'] = FlowManager;
module.exports = exports['default'];