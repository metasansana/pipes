import WorkBuilder from './WorkBuilder';
import Flow from './Flow';

/**
 * @typedef {object} Filters
 * @property {array} ['?']
 * @property {array} ['*']
 * @property {array} ['@after']
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
 * @param {object} builtins 
 */
class Pipe {

    constructor(spec, builtins) {
        this._spec = spec;
        this._builtins = builtins;
        this._events = Object.create(null);
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
