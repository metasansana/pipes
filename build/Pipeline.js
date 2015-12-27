/**
 * Pipeline processes a sequence of filters one by one
 * @param {string} key 
 * @param {*} value 
 * @param {Flow} flow The Flow that created this Pipeline
 * @param {array} work An array of filters to pass the key value through
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pipeline = (function () {
    function Pipeline(key, value, work, flow) {
        _classCallCheck(this, Pipeline);

        this.key = key;
        this.value = value;
        this._work = work;
        this._flow = flow;
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

    _createClass(Pipeline, [{
        key: "next",
        value: function next(err, key, value) {

            var tmp;
            var f;
            var args = [];

            if (err) return this._flow.finished(err, key, value);

            if (this._work.length === 0) return this._flow.finished(null, key, value);

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
        key: "run",
        value: function run() {
            this.next(null, this.key, this.value);
        }
    }]);

    return Pipeline;
})();

Pipeline.create = function (key, value, flow, work) {
    return new Pipeline(key, value, flow, work);
};

exports["default"] = Pipeline;
module.exports = exports["default"];