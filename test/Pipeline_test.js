import must from 'must';
import Pipeline from '../src/Pipeline';

var line;
var spec;

function x(key, value, line, right) {
    line.next(null, key, value * right);
}

function pipe(key, value, line) {
    line.next(null, key, value);
}

describe('Pipeline', function() {
    describe('Pipeline.run', function() {
        it('should run everyting', function(done) {

            line = new Pipeline('number', 40, [
                [pipe],
                [pipe],
                [x, 3]
            ], {
                finished(err, key, value) {
                    must(value).equal(120);
                    done();
                }

            }, []);

            line.run();

        })
    })
})
