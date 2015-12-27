import Pipe from './Pipe';
import PipeError from './PipeError';

export {
    Pipe as Pipe,
    PipeError as PipeError
};

export function createPipe(spec) {
    return new Pipe(spec);
}
