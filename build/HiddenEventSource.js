/**
 * HiddenEventSource 
 * @implements {EventSource}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HiddenEventSource = (function () {
    function HiddenEventSource() {
        _classCallCheck(this, HiddenEventSource);

        this._events = Object.create(null);
        this._removals = Object.create(null);
    }

    _createClass(HiddenEventSource, [{
        key: "on",
        value: function on(event, cb) {
            this._events[event] = this._events[event] || [];
            if (this._events[event].indexOf(cb) < 0) this._events[event].push(cb);
            return this;
        }
    }, {
        key: "once",
        value: function once(event, cb) {
            var _arguments = arguments;

            this.on(event, function () {
                return cb.apply(null, _arguments);
            });
            this._removals[event] = this._removals[event] || [];
            this._removals[event].push(this._events[event].length - 1);
        }
    }, {
        key: "emit",
        value: function emit(evt) {
            var _this = this,
                _arguments2 = arguments;

            if (Array.isArray(this._events[evt])) this._events[evt].slice().forEach(function (f, i) {

                if (Array.isArray(_this._removals[evt])) if (_this._removals[evt].indexOf(i) > -1) _this._events[evt].splice(i, 1);

                f.apply(null, Array.prototype.splice.call(_arguments2, 1));
            });
        }
    }]);

    return HiddenEventSource;
})();

exports["default"] = HiddenEventSource;
module.exports = exports["default"];