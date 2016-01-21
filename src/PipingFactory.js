import Pipe from './Pipe';
import Pipeline from './Pipeline';
/**
 * PipingFactory 
 * @param {FlowManager} manager 
 * @param {Specification} spec 
 */
class PipingFactory {

    constructor(manager, spec) {
        this._manager = manager;
        this._spec = spec;
    }

    /**
     * create a new Piping
     * @param {string} key 
     * @param {*} value 
     * @param {array|object|string} specLine
     * @returns {Piping} 
     */
    create(key, value, specLine) {

        var line;

        if ((typeof specLine === 'object') && (!Array.isArray(specLine))) {
            line = new Pipe(specLine, this._spec.builtins);
            return line.
            on('error', (err, value) => this._manager.error(err, key, value)).
            on('success', (value) => this._manager.success(key, value)).
            run(value, function() {});
        }

        line = new Pipeline(key, value, this._spec.get(key), this._spec.builtins);

        return line.
        on('error', this._manager.error.bind(this._manager)).
        on('success', this._manager.success.bind(this._manager)).
        run();

    }

}

export default PipingFactory
