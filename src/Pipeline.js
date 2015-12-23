/**
 * Pipeline processes a sequence of filters one by one
 * @param {string} key 
 * @param {*} value 
 * @param {Flow} flow The Flow that created this Pipeline
 * @param {array} work An array of filters to pass the key value through
 */
class Pipeline {

    constructor(key, value, work, flow) {
        this.key = key;
        this.value = value;
        this._work = work;
        this._flow = flow;
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
            return this._flow.finished(err, key, value);

        if (this._work.length === 0)
            return this._flow.finished(null, key, value);

        tmp = this._work.shift();

        if (Array.isArray(tmp)) {
            f = tmp.shift();
            args = tmp;
        } else {
            f = tmp;
        }

        args.unshift(value);
        args.unshift(key);
        args.push(this);
        f.apply(null, args);

    }

    /**
     * run this pipeline
     */
    run() {
        this.next(null, this.key, this.value);
    }

}

Pipeline.create = function(key, value, flow, work) {
    return new Pipeline(key, value, flow, work);
}

export default Pipeline
