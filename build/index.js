'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Pipe = require('./Pipe');

var _Pipe2 = _interopRequireDefault(_Pipe);

function create(spec) {
    return new _Pipe2['default'](spec);
}

module.exports = exports['default'];