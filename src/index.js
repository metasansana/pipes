import Pipe from './Pipe';

var builtins = Object.create(null);

export {
    Pipe as Pipe
};

export function createPipe(spec, builtins) {
    return new Pipe(spec, builtins || Object.create(null));
}
