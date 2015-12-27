/**
 * WorkBuilder allows us to compile a map based on the spec and the object to
 * be pipelined.
 *
 * It is used to generate a new filter spec, based on the values of the actual
 * object being filtered.
 * @param {Filters} spec 
 * @param {object} o 
 * @param {object} builtins 
 */
class WorkBuilder {

    constructor(spec, o, builtins) {
        this.spec = spec;
        this.o = o;
        this.builtins = builtins;
    }

    _keys(spec) {

        var keys = Object.keys(spec);
        WorkBuilder.KEYWORDS.forEach(word => {

            var loc = keys.indexOf(word);

            if (loc > -1)
                keys.splice(loc, 1);
        });
        return keys;
    }

    _many(value, spec) {

        value = (Array.isArray(value)) ? value : [value];
        return value.map(v => spec.slice());

    }

    _substitute(line, builtins) {

        var filter;

        if (!line) return line;

        for (var i = 0; i < line.length; i++) {

            filter = line[i];

            if (typeof filter === 'string') {
                if (!builtins[filter]) throw new Error(`Unknown filter '${filter}' detected!`);
                line[i] = builtins[filter]
            } else if (Array.isArray(filter)) {
                if (typeof filter[0] === 'string')
                    filter[0] = builtins[filter[0]]
            }
            return line;

        }
    }

    /**
     * build the spec
     * @returns {object}
     */
    build() {

        var work = Object.create(null);
        var spec = this.spec;

        Object.keys(this.o).
        concat(this._keys(spec)).
        filter((key, index, array) => (array.indexOf(key) === index)).
        forEach(key => {

            work[key] = [];

            if (WorkBuilder.KEYWORDS.indexOf(key) > -1) {
                work[key] = null;
            } else {

                if (spec[key]) {
                    work[key] = work[key].concat(spec[key]);
                } else if (spec['?']) {
                    work[key] = work[key].concat(spec['?']);
                }

                if (spec['*'])
                    work[key] = work[key].concat(spec['*']);

                if (work[key].length === 0)
                    work[key] = null;
            }

            work[key] = this._substitute(work[key], this.builtins);

        });

        return work;
    }

}

WorkBuilder.KEYWORDS = ['@after', '?', '*'];
export default WorkBuilder
