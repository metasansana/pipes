/**
 * Builtins is a wrapper class for the builtins object
 * @param {object} list 
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Builtins = (function () {
    function Builtins(list) {
        _classCallCheck(this, Builtins);

        this.list = list;
    }

    /**
     * substitute will turn an string or array into a work
     * array.
     * @param {array|string|null} work 
     */

    _createClass(Builtins, [{
        key: 'substitute',
        value: function substitute(line) {

            var filter;

            if (!line) return line;

            line = typeof line === 'string' ? [line] : line;

            for (var i = 0; i < line.length; i++) {

                filter = line[i];

                if (typeof filter === 'string') {
                    if (!this.list[filter]) throw new Error('Unknown filter \'' + filter + '\' detected!');
                    line[i] = this.list[filter];
                } else if (Array.isArray(filter)) {
                    if (typeof filter[0] === 'string') filter[0] = this.list[filter[0]];
                }

                return line;
            }
        }
    }]);

    return Builtins;
})();

exports['default'] = Builtins;
module.exports = exports['default'];