
/**
 * EventSource is an api for event generators.
 * @interface
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventSource = (function () {
  function EventSource() {
    _classCallCheck(this, EventSource);
  }

  _createClass(EventSource, [{
    key: "on",

    /**
     * on registers a callback for a specific event.
     * @param {string} event 
     * @param {function} cb 
     * @returns {EventSource}
     */
    value: function on(event, cb) {}

    /**
     * once registers a callback for a specific event.
     * It will be removed once it has fired
     * @param {string} event 
     * @param {function} cb 
     *  @return EventSourcee}
     */
  }, {
    key: "once",
    value: function once(event, cb) {}

    /**
     * emit an event
     * @param {string} event 
     * @param {...*} args 
     */
  }, {
    key: "emit",
    value: function emit(event) {}
  }]);

  return EventSource;
})();

exports["default"] = EventSource;
module.exports = exports["default"];