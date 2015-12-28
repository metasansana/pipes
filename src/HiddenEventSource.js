/**
 * HiddenEventSource 
 * @implements {EventSource}
 */
class HiddenEventSource {
    constructor() {
        this._events = Object.create(null);
        this._removals = Object.create(null);
    }

    on(event, cb) {
        this._events[event] = this._events[event] || [];
        if (this._events[event].indexOf(cb) < 0)
            this._events[event].push(cb);
        return this;
    }

    once(event, cb) {

        this.on(event, () => cb.apply(null, arguments));
        this._removals[event] = this._removals[event] || [];
        this._removals[event].push(this._events[event].length - 1);

    }

    emit(evt) {

        if (Array.isArray(this._events[evt]))
            this._events[evt].slice().forEach((f, i) => {

                if (Array.isArray(this._removals[evt]))
                    if (this._removals[evt].indexOf(i) > -1)
                        this._events[evt].splice(i, 1)

                f.apply(null, Array.prototype.splice.call(arguments, 1))

            });
    }

}


export default HiddenEventSource
