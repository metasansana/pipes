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

/**
 * Flow represents the actual 'flowing' of the target object keys
 * into the various pipe lines.
 * @param {object} work 
 * @param {object} o 
 * @param {Pipe} pipe
 * @param {array} after 
 */

var Flow = (function () {
    function Flow(work, o, pipe, after) {
        _classCallCheck(this, Flow);

        this._work = work;
        this._o = o;
        this._pipe = pipe;
        this._after = after;
        this._errors = Object.create(null);
        this._errorCount = 0;
        this._filtered = Object.create(null);
        this._count = 0;
    }

    /**
     * emit broadcasts an event to interested listeners
     * @param {string} evt 
     * @param {...*} args
     */

    _createClass(Flow, [{
        key: 'emit',
        value: function emit() {
            this._pipe.emit.apply(this._pipe, arguments);
        }

        /**
         * finished
         * @param {string} err 
         * @param {string} key 
         * @param {*} value
         */
    }, {
        key: 'finished',
        value: function finished(err, key, value) {

            if (err) {
                this._errors[key] = err;
                this._errorCount = this._errorCount + 1;
            }

            if (key === '@after') return this._pipe.emit('done', this._errorCount > 0 ? new _PipeError2['default'](this._errors, this._errorCount) : null, this._filtered);

            if (!err) this._filtered[key] = value;
            console.log('sigh count ', this._count, this._work);
            this._count = this._count - 1;

            if (this._count === 0) {
                if (this._after && this._errorCount === 0) _Pipeline2['default'].create('@after', this._filtered, this._after, this).run();else this._pipe.emit('done', this._errorCount > 0 ? new _PipeError2['default'](this._errors, this._errorCount) : null, this._filtered);
            }
        }
    }, {
        key: 'run',
        value: function run() {
            for (var key in this._work) if (Object.prototype.hasOwnProperty.call(this._work, key)) if (this._work[key] !== null) {
                this._count = this._count + 1;
                _Pipeline2['default'].create(key, this._o[key] || null, this._work[key], this).run();
            }
        }
    }]);

    return Flow;
})();

exports['default'] = Flow;
module.exports = exports['default'];