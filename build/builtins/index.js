'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.required = required;
exports.$array = $array;
function t(template, data) {
    return template.replace(/\{([\w\.\-]*)\}/g, function (s, k) {
        return k.split('.').reduce(function (val, i) {
            return val[i];
        }, data);
    });
}

//Validators

function required(key, value, line, msg) {

    if (value !== null) return line.next(null, key, value);

    line.next(new Error(t(msg || '{key} is required!', {
        key: key, value: value
    })), key, value);
}

//special

function $array(key, value, line) {
    line.next(null, key, value);
}