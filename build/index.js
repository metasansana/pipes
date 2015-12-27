'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createPipe = createPipe;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Pipe = require('./Pipe');

var _Pipe2 = _interopRequireDefault(_Pipe);

var _PipeError = require('./PipeError');

var _PipeError2 = _interopRequireDefault(_PipeError);

exports.Pipe = _Pipe2['default'];
exports.PipeError = _PipeError2['default'];

function createPipe(spec) {
    return new _Pipe2['default'](spec);
}