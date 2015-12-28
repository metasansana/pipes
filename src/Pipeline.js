import * as events from 'events';
/**
 * Pipeline processes a sequence of filters one by one
 * @param {string} key 
 * @param {*} value 
 * @param {array} work An array of filters to pass the key value through
 */
class Pipeline {

    constructor(key, value, work) {
        this.key = key;
        this.value = value;
        this._work = work;
        this._events = new events.EventEmitter();
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
     * next processes the next filter in this pipeline.
     *
     * Next calls each filter with the following signature:
     * function(key, value, arg1..argn, pipeline)
     * Where arg1..argn represents any arguments the user supplied
     * when declaring the line spec. Pipeline refers to the current
     * instance.
     * @param {string} err 
     * @param {string} key
     * @param {*} value 
     */
    next(err, key, value) {

        var tmp;
        var f;
        var args = [];

        if (err)
            return this._events.emit('error', err, key, value);

        if (this._work.length === 0)
            return this._events.emit('success', key, value);

        tmp = this._work.shift();

        if (Array.isArray(tmp)) {
            f = tmp.shift();
            args = tmp;
        } else {
            f = tmp;
        }

        args.unshift(this);
        args.unshift(value);
        args.unshift(key);
        f.apply(null, args);

    }

    /**
     * run this pipeline
     */
    run() {
        this._events.emit('start');
        this.next(null, this.key, this.value);
    }

}

Pipeline.create = function(key, value, flow, work) {
    return new Pipeline(key, value, flow, work);
}

export default Pipeline
