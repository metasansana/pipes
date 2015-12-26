/**
 * WorkBuilder allows us to compile a map based on the spec and the object to
 * be pipelined.
 *
 * It is used to generate a new filter spec, based on the values of the actual
 * object being filtered.
 * @param {Filters} spec 
 * @param {object} o 
 * @param {object} builtins 
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var WorkBuilder = (function () {
    function WorkBuilder(spec, o, builtins) {
        _classCallCheck(this, WorkBuilder);

        this.spec = spec;
        this.o = o;
        this.builtins = builtins;
    }

    _createClass(WorkBuilder, [{
        key: '_isForArrays',
        value: function _isForArrays(key) {

            if (key[0] === '[') if (key[key.length - 1] === ']') return true;
            return false;
        }
    }, {
        key: '_keys',
        value: function _keys(spec) {

            var keys = Object.keys(spec);
            WorkBuilder.KEYWORDS.forEach(function (word) {

                var loc = keys.indexOf(word);

                if (loc > -1) keys.splice(loc, 1);
            });
            return keys;
        }
    }, {
        key: '_many',
        value: function _many(value, spec) {

            value = Array.isArray(value) ? value : [value];
            return value.map(function (v) {
                return spec.slice();
            });
        }
    }, {
        key: '_substitute',
        value: function _substitute(line, builtins) {

            var filter;

            if (!line) return line;

            for (var i = 0; i < line.length; i++) {

                filter = line[i];

                if (typeof filter === 'string') line[i] = builtins[filter];else if (Array.isArray(filter)) if (typeof filter[0] === 'string') filter[0] = builtins[filter[0]];

                return line;
            }
        }

        /**
         * build the spec
         * @returns {object}
         */
    }, {
        key: 'build',
        value: function build() {
            var _this = this;

            var work = Object.create(null);
            var spec = this.spec;

            Object.keys(this.o).concat(this._keys(spec)).filter(function (key, index, array) {
                return array.indexOf(key) === index;
            }).forEach(function (key) {

                work[key] = [];

                if (WorkBuilder.KEYWORDS.indexOf(key) > -1) {
                    work[key] = null;
                } else {

                    if (spec[key]) {
                        work[key] = work[key].concat(spec[key]);
                    } else if (spec['?']) {
                        work[key] = work[key].concat(spec['?']);
                    }

                    if (spec['*']) work[key] = work[key].concat(spec['*']);

                    if (work[key].length === 0) work[key] = null;
                }

                work[key] = _this._substitute(work[key], _this.builtins);
            });

            return work;
        }
    }]);

    return WorkBuilder;
})();

WorkBuilder.KEYWORDS = ['@after', '?', '*'];
exports['default'] = WorkBuilder;
module.exports = exports['default'];