import Pipe from './Pipe';
import PipeError from './PipeError';

export {
    Pipe as Pipe,
    PipeError as PipeError
};

export function create(spec) {
    return new Pipe(spec);
}
