/**
 * Load represents the work a Pipeline has to do.
 * It is used as a wrapper to convert the user supplied 
 * values into something actionable.
 * @param {array} specLine 
 * @param {Specification} spec 
 * @param {Builtins} builtins 
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Load = function Load(specLine, spec, builtins) {
    _classCallCheck(this, Load);

    this._specLine = specLine;
    this._spec = spec;
    this._builtins = builtins;
};

exports["default"] = Load;
module.exports = exports["default"];