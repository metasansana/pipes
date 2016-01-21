'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Pipe = require('./Pipe');

var _Pipe2 = _interopRequireDefault(_Pipe);

var _Pipeline = require('./Pipeline');

var _Pipeline2 = _interopRequireDefault(_Pipeline);

/**
 * PipingFactory 
 * @param {FlowManager} manager 
 * @param {Specification} spec 
 */

var PipingFactory = (function () {
    function PipingFactory(manager, spec) {
        _classCallCheck(this, PipingFactory);

        this._manager = manager;
        this._spec = spec;
    }

    /**
     * create a new Piping
     * @param {string} key 
     * @param {*} value 
     * @param {array|object|string} specLine
     * @returns {Piping} 
     */

    _createClass(PipingFactory, [{
        key: 'create',
        value: function create(key, value, specLine) {
            var _this = this;

            var line;

            if (typeof specLine === 'object' && !Array.isArray(specLine)) {
                line = new _Pipe2['default'](specLine, this._spec.builtins);
                return line.on('error', function (err, value) {
                    return _this._manager.error(err, key, value);
                }).on('success', function (value) {
                    return _this._manager.success(key, value);
                }).run(value, function () {});
            }

            line = new _Pipeline2['default'](key, value, this._spec.get(key), this._spec.builtins);

            return line.on('error', this._manager.error.bind(this._manager)).on('success', this._manager.success.bind(this._manager)).run();
        }
    }]);

    return PipingFactory;
})();

exports['default'] = PipingFactory;
module.exports = exports['default'];