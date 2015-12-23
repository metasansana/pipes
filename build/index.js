'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createPipe = createPipe;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Pipe = require('./Pipe');

var _Pipe2 = _interopRequireDefault(_Pipe);

var builtins = Object.create(null);

exports.Pipe = _Pipe2['default'];

function createPipe(spec, builtins) {
    return new _Pipe2['default'](spec, builtins || Object.create(null));
}