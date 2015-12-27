import Pipeline from './Pipeline';
import PipeError from './PipeError';
/**
 * Flow represents the actual 'flowing' of the target object keys
 * into the various pipe lines.
 * @param {object} work 
 * @param {object} o 
 * @param {Pipe} pipe
 * @param {array} after 
 */
class Flow {

    constructor(work, o, pipe, after) {
        this._work = work;
        this._o = o;
        this._pipe = pipe;
        this._after = after;
        this._errors = Object.create(null);
        this._errorCount = 0;
        this._filtered = Object.create(null);
        this._count = 0;
    }

    /**
     * emit broadcasts an event to interested listeners
     * @param {string} evt 
     * @param {...*} args
     */
    emit() {
        this._pipe.emit.apply(this._pipe, arguments);
    }

    /**
     * finished
     * @param {string} err 
     * @param {string} key 
     * @param {*} value
     */
    finished(err, key, value) {

        if (err) {
            this._errors[key] = err;
            this._errorCount = this._errorCount + 1;
        }

        if (key === '@after')
            return this._pipe.emit('done', (this._errorCount > 0) ?
                new PipeError(this._errors, this._errorCount) : null,
                this._filtered);

        if (!err)
            this._filtered[key] = value;
console.log('sigh count ' ,this._count, this._work);
        this._count = this._count - 1;

        if (this._count === 0) {
            if (this._after && (this._errorCount === 0))
                Pipeline.create('@after', this._filtered, this._after, this).run();
            else
                this._pipe.emit('done', (this._errorCount > 0) ?
                    new PipeError(this._errors, this._errorCount) : null,
                    this._filtered);
        }

    }

    run() {
        for (var key in this._work)
            if (Object.prototype.hasOwnProperty.call(this._work, key))
                if (this._work[key] !== null) {
                    this._count = this._count + 1;
                    Pipeline.create(key, this._o[key] || null, this._work[key], this).run();
                }
    }
}

export default Flow
