'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.$required = $required;
exports.$array = $array;
exports.$cast = $cast;
exports.$repeat = $repeat;
exports.$set = $set;
exports.$keep = $keep;
function t(template, data) {
    return template.replace(/\{([\w\.\-]*)\}/g, function (s, k) {
        return k.split('.').reduce(function (val, i) {
            return val[i];
        }, data);
    });
}

//Validators

function $required(key, value, line, msg) {

    if (!value) return line.next(new Error(t(msg || '{key} is required!', {
        key: key,
        value: value
    })), key, value);

    line.next(null, key, value);
}

function $array(key, value, line, msg) {

    if (!Array.isArray(value)) return line.next(new Error(t(msg || '{key} must be an array!', {
        key: key,
        value: value
    })), key, value);

    line.next(null, key, value);
}

/**
 * $cast will cast a value to the required type
 * Currently deals with string, number and array.
 * @todo object support
 * @param {string} key
 * @param {*} value 
 * @param {Pipeline} line 
 * @param {string} [type='string']
 * @param {string} [marker=','] Used when casting to array
 * @param {string} [message] 
 */

function $cast(key, value, line, type, marker, message) {

    type = type || 'string';
    marker = marker || ',';
    message = message || 'Could not turn {key} to {type}!';

    switch (type) {

        case 'string':
            value = String(value);
            break;

        case 'number':
            value = Number(value);
            break;

        case 'array':

            if (Array.isArray(value)) value = value;else if (typeof value === 'string') value = value.split(marker);else value = [value];

            break;

        default:
            value = String(value);
            break;

    }

    if (value === null) return line.next(new Error(t(message, {
        key: key,
        value: value,
        type: type
    })));

    line.next(null, key, value);
}

//special

function $repeat(key, value, line, spec) {

    var Pipe = require('../Pipe');
    var pipe;
    var f;
    var newValues = [];

    value = !Array.isArray(value) ? value = [value] : value;
    value = value.slice();
    pipe = new Pipe(spec, line.builtins);

    f = function (pipe, line, key, value, newValues) {

        if (value.length === 0) return line.next(null, key, newValues);

        pipe.run(value.shift(), function (err, o) {

            if (err) return line.next(err, key, value);
            newValues.push(o);
            f(pipe, line, key, value, newValues);
        });
    };

    f(pipe, line, key, value, newValues);
}

function $set(key, oldValue, line, newValue) {

    line.next(null, key, newValue);
}

/**
 * $keep keeps a key on the object
 * @param {string} key 
 * @param {*} value 
 * @param {Pipeline} line 
 */

function $keep(key, value, line) {
    return line.next(null, key, value);
}