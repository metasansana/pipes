import must from 'must';
import Pipe from '../src/Pipe';

var pipe

function x(key, value, line, m) {
    line.next(null, key, value * m);
}

describe('Validation builtin', function() {

    describe('required', function() {

        it('should give an error if the property was not supplied', function(done) {

            pipe = new Pipe({
                id: ['required']
            });

            pipe.run({
                _id: 'mongojumbo'
            }, function(err, o) {
                must(err.errors.id.message).equal('id is required!');
                done();
            });

        });

    });

    describe('$array', function() {
        it('should recurse', function(done) {

            pipe = new Pipe({
                spread: ['$array', [x, 1],
                    [x, 2],
                    [x, 3]
                ]
            });

            pipe.run({
                spread: [2,2,2],
            }, function(err, o) {
              must(o.spread).eql([2,4,6]);
                done();
            });


        });
    });



});
