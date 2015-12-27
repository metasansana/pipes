import WorkBuilder from './WorkBuilder';
import Flow from './Flow';
import * as builtins from './builtins';

var combine = (pipe, filters) => {
    for (var key in filters)
        pipe.addFilter(key, filters[key]);
};

/**
 * @typedef {object} Filters
 * @property {array} ['?']
 * @property {array} ['*']
 * @property {array} ['@after']
 */

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
 * It takes a Filters as it's only constructor argument
 * which specifies the work to be done on each key.
 *
 * A Filters is simply a javascript object that may look like this:
 * {
 *    id: [[number],[max, 10]],
 *    created_by: [[exist, 'users', 'id']],
 *    '?': [['stringify']],
 *    '*': [['shorten, 12]],
 *    '@after': [timestamp]
 * }
 *
 * In the above spec, we pass the 'id' and 'created_by' fields through 
 * the filters we have defined. In this case, the filters are passed
 * as functions (number, max, exist); in each array,
 * the first key indicates the filter to be called and the remaining
 * members are treated as arguments.
 *
 * The '?', '*' and '@after' are special keywords that indicate:
 *
 * '?' -> Pass any unknown keys through this pipeline
 * '*' -> Pass all keys through this pipeline when finished
 * '@after' -> The final object is passed through this pipeline ONLY if there
 *             are no errors
 *
 * @param {Filters} spec 
 */
class Pipe {

    constructor(spec) {
        this._spec = spec;
        this._builtins = Object.create(null);
        this._events = Object.create(null);
        combine(this, builtins);
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
     * on queues up a callback to be called when an event occurs
     * @param {string} event 
     * @param {function} cb 
     */
    on(event, cb) {
        this._events[event] = this._events[event] || [];
        if (this._events[event].indexOf(cb) < 0)
            this._events[event].push(cb);
        return this;
    }

    /**
     * emit broadcasts an event to interested listeners
     * @param {string} evt 
     * @param {...*} args
     */
    emit(evt) {
        if (Array.isArray(this._events[evt]))
            this._events[evt].slice().forEach(f => f.apply(null,
                Array.prototype.splice.call(arguments, 1)));
    }

    /**
     * run starts the pipe lines based on the internal spec
     */
    run(o, cb) {

        var builder = new WorkBuilder(this._spec, o, this._builtins);
        var work;
        var flow;

        work = builder.build();
        flow = new Flow(work, o, this, this._spec['@after'] || null);
        this.on('done', cb);
        flow.run();

    }

}

export default Pipe
