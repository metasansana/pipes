function t(template, data) {
    return template.replace(/\{([\w\.\-]*)\}/g, function(s, k) {
        return k.split('.').reduce(function(val, i) {
            return val[i];
        }, data);
    });
}

//Validators
export function $required(key, value, line, msg) {

    if (!value)
        return line.next(new Error(t(msg || '{key} is required!', {
            key, value
        })), key, value);

    line.next(null, key, value);

}
export function $array(key, value, line, msg) {

    if (!Array.isArray(value))
        return line.next(
            new Error(t(msg || '{key} must be an array!', {
                key, value
            })), key, value);

    line.next(null, key, value);

}

//special
export function $repeat(key, value, line, spec) {

    var Pipe = require('../Pipe');
    var pipe;
    var f;
    var newValues = [];

    value = (!Array.isArray(value)) ? value = [value] : value;
    value = value.slice();
    pipe = new Pipe(spec, line.builtins);

    f = function(pipe, line, key, value, newValues) {

        if (value.length === 0)
            return line.next(null, key, newValues);

        pipe.run(value.shift(), (err, o) => {

            if (err) return line.next(err, key, value);
            newValues.push(o);
            f(pipe, line, key, value, newValues);

        });

    };

    f(pipe, line, key, value, newValues);

}
