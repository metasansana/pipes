/**
 * Line process the operations specified for a single map key
 * @param {string} key 
 * @param {*} value 
 * @param {Pipe} pipe 
 * @param {Array} steps 
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = (function () {
    function Line(key, value, pipe, steps) {
        _classCallCheck(this, Line);

        this.key = key;
        this.value = value;
        this._pipe = pipe;
        this._steps = steps.slice();
    }

    /**
     * next 
     * @param {string} err 
     * @param {*} value 
     */

    _createClass(Line, [{
        key: "next",
        value: function next(err, value) {

            var step;
            var f;

            if (err) return this._pipe.finished(err, this.key, value);
            if (this._steps.length === 0) return this._pipe.finished(null, this.key, value);

            step = this._steps.shift();
            step = step.slice();
            f = step.shift();

            this.value = value;

            f.apply(null, step.concat(this));
        }

        /**
         * run the line
         */
    }, {
        key: "run",
        value: function run() {
            this.next(null, this.value);
        }
    }]);

    return Line;
})();

exports["default"] = Line;
module.exports = exports["default"];