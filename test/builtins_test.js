import must from 'must';
import Pipe from '../src/Pipe';
import PipeError from '../src/PipeError';

var pipe

function x(key, value, line, m) {
    line.next(null, key, value * m);
}

describe('Validation builtin', function() {

    describe('$required', function() {

        it('should give an error if the property was not supplied', function(done) {

            pipe = new Pipe({
                id: ['$required', '$required', '$required']
            });

            pipe.run({
                _id: 'mongojumbo'
            }, function(err, o) {
                must(err).not.be.null();
                must(err.errors.id).equal('id is required!');
                done();
            });

        });

    });

    describe('$array', function() {
        xit('requires an array', function(done) {

            pipe = new Pipe({
                spread: ['$array']
            });

            pipe.run({
                spread: 2,
            }, function(err, o) {
                must(err instanceof PipeError).be.true();
                done();
            });
        });
    });

    describe('$repeat', function() {
        it('should repeat', function(done) {

            pipe = new Pipe({
                multiply: [

                    ['$repeat', {
                        b: [
                            [x, 10]
                        ]
                    }]

                ]
            });

            pipe.run({
                multiply: [{
                    b: 1
                }, {
                    b: 1
                }, {
                    b: 2
                }]
            }, function(err, o) {
                must(o.multiply).eql([{
                    b: 10
                }, {
                    b: 10
                }, {
                    b: 20
                }]);
                done();
            });


        });
    });



});
