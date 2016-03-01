import Pipeline from './Pipeline';
import PipeError from './PipeError';
import PipingFactory from './PipingFactory';

/**
 * FlowManager manages the actual 'flowing' of the target object keys
 * into the various pipe lines.
 * @param {Specification} spec 
 * @param {object} o 
 * @param {EventSource} pipe
 */
class FlowManager {

    constructor(spec, pipe) {
        this._spec = spec;
        this._pipe = pipe;
        this._errors = Object.create(null);
        this._errorCount = 0;
        this._filtered = Object.create(null);
        this._count = 0;
    }

    /**
     * error is called when an error occurs
     * @param {Error} err 
     * @param {string} key 
     * @param {*} value 
     */
    error(err, key, value) {
        this._count = this._count - 1;
        this._errors[key] = err.message;
        this._errorCount = this._errorCount + 1;
        this.finish();
    }

    /**
     * success 
     * @param {string} key 
     * @param {*} value 
     */
    success(key, value) {

        this._count = this._count - 1;

        if ((value !== null) && (value !== undefined))
            this._filtered[key] = value;

        this.finish();

    }

    /**
     * finish
     */
    finish() {

        if (this._count !== 0) return;

        if (this._errorCount > 0)
            return this._pipe.emit('error',
                new PipeError(this._errors, this._errorCount),
                this._filtered);

        Pipeline.create('@after', this._filtered, this._spec.after()).
        on('error', (err, key, value) =>
            this._pipe.emit('error', new PipeError({
                '@after': err
            }, 1))).
        on('success', () => this._pipe.emit('success', this._filtered)).run();

    }

    run(o, $this) {

        var factory = new PipingFactory(this, this._spec);
        var runs = this._spec.keys();
        this._count = runs.length;
        runs.
        forEach(k => factory.create(k, o[k], this._spec.spec[k], $this));

    }

}

export default FlowManager
