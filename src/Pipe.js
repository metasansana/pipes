import FlowManager from './FlowManager';
import Specification from './Specification';
import * as builtins from './builtins';
import events from 'events';

var combine = (pipe, filters) => {
    for (var key in filters)
        pipe.addFilter(key, filters[key]);
};

/**
 * @typedef {function} Filter
 * @param {string} key The key of the property being filtered.
 * @param {*} value The value of the property being filtered.
 * @param {Pipeline} line The current pipeline being processed.
 * @param {...*} args Various arguments passed to the filter by the spec
 */

/**
 * Pipe is the main entry point of this library.
 *
 * A Pipe acts as a set of filters that can be used to transform
 * or simply validate the keys of an object.
 *
 * It takes a Specification as it's only constructor argument
 * which specifies the work to be done on each key.
 *
 * @param {object} spec 
 * @param {object} [passedBuiltins] 
 */
class Pipe {

    constructor(spec, passedBuiltins) {

        this._spec = spec;
        this._builtins = Object.create(null);
        this._events = new events.EventEmitter();

        combine(this, builtins);
        if (passedBuiltins)
            combine(this, passedBuiltins)

    }

    on() {
        this._events.on.apply(this._events, arguments);
        return this;
    }

    once() {
        this._events.once.apply(this._events, arguments);
        return this;
    }

    /**
     * addFilter adds a filter, transform, validator etc to the list
     * so it can be referenced by name.
     * @param {string} key 
     * @param {Filter} f 
     * @returns {Pipe}
     */
    addFilter(key, f) {
        this._builtins[key] = f;
        return this;
    }

    /**
     * run starts the pipe lines based on the internal spec
     */
    run(o, cb) {
        var manager = new FlowManager(new Specification(this._spec, o, this._builtins), this._events);
        this.once('error', (err, o) => cb(err, o));
        this.once('success', o => cb(null, o));
        this._events.emit('start');
        manager.run(o);

    }

}

export default Pipe
