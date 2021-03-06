'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _builtins = require('./builtins');

var builtins = _interopRequireWildcard(_builtins);

exports['default'] = function (pipe) {
    for (var key in builtins) pipe.addFilter(key, builtins[key]);
};

module.exports = exports['default'];