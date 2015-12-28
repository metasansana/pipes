/**
 * PipeError is used to neatly combine the
 * errors of the various filters. It is not intended to ever 
 * be thrown.
 * @param {object} errors A list of all the errors that have occured
 * @param {number} count  The number of errors that have occured.
 */
class PipeError extends Error {

    constructor(errors, count) {
        super(`${count} errors occured during pipe flow! See them in the errors property!`);
        this.errors = errors;
        this.count = count;
    }
}
export default PipeError
