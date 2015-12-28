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

function error(key, value, line) {
    line.next(new Error('err'), key, value);
}

describe('Pipeline', function() {
    describe('Pipeline.run', function() {
        it('should fire success events', function(done) {

            line = new Pipeline('number', 40, [
                [pipe],
                [pipe],
                [x, 3]
            ]);

            line.on('success', (key, value) => {
                must(value).equal(120);
                must(key).equal('number');
                done();
            });

            line.on('error', () => {
                throw new Error('error should not be emitted!')
            });

            line.run();

        });

        it('should fire error events', function(done) {

            line = new Pipeline('number', 40, [
                [pipe],
                [pipe],
                [error]
            ]);

            line.on('error', (err, key, value) => {
                must(err.message).equal('err');
                must(key).equal('number');
                done();
            });

            line.on('success', () => {
                throw new Error('success should not be emitted')
            });
            line.run();


        })
    })
})
