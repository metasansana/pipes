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
        it('requires an array', function(done) {

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

    describe('$cast', function() {

        it('should cast', function(done) {

            pipe = new Pipe({
                string: [
                    ['$cast', 'string']
                ],
                number: [
                    ['$cast', 'number']
                ],
                array: [
                    ['$cast', 'array']
                ]
            });

            pipe.run({
                string: 1,
                number: '1',
                array: 'one,2,three'
            }, function(err, o) {
                must(o.string).be('1');
                must(o.number).be(1);
                must(o.array).eql(['one', '2', 'three']);
                done();
            });

        });
    });

    describe('$keep', function() {

        it('should keep', function(done) {

            pipe = new Pipe({
                baby: ['$keep']
            });

            pipe.run({
                baby: 'Kareem'
            }, function(err, o) {
                must(o.baby).be('Kareem');
                done();
            });

        });
    });
});
