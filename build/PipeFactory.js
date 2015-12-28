
/**
 * PipelineFactory creates Pipe or Pipeline objects 
 * depending on what the spec calls for.
 * @param {Pipe} pipe
 * @param {FlowManager} manager 
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PipelineFactory = (function () {
  function PipelineFactory(pipe, manager) {
    _classCallCheck(this, PipelineFactory);

    this._pipe = pipe;
    this._manager = manager;
  }

  /**
   * create creates the necessary objects.
   * It does not return anything, instead it makes use of the main Pipe's
   * event system.
   * @param {string} key 
   * @param {*} value 
   * @param {array|object|string} specLine
   */

  _createClass(PipelineFactory, [{
    key: "create",
    value: function create(key, value, specLine) {}
  }]);

  return PipelineFactory;
})();

exports["default"] = PipelineFactory;
module.exports = exports["default"];