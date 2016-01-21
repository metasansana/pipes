import must from 'must';
import Pipe from '../src/Pipe';
import PipeError from '../src/PipeError';

var pipe;
var spec;

function set(key, value, line, change) {
    line.next(null, key, change);
}

function pipeit(key, value, line) {
    line.next(null, key, value);
}

function inc(key, value, line, i) {
    line.next(null, key, value + i);
}

function upper(key, value, line) {
    line.next(null, key, value.toUpperCase());
}

function error(key, value, line, msg) {
    line.next(new Error(msg), key, value);
}

function id(key, value, line) {
    value.id = 100;
    line.next(null, key, value);
}

describe('Pipe', function() {

    describe('Pipe.run', function() {

        it('should run everyting', function(done) {

            spec = {
                name: [
                    [upper]
                ],
                count: [
                    [pipeit],
                    [inc, 10]
                ],
                status: [
                    pipeit, pipeit, [set, 'my status']
                ],
                nested: {
                    bluebird: [pipeit],
                    pinkbird: [pipeit],
                    branch: {
                        complex: [pipeit]
                    }
                }

            };

            pipe = new Pipe(spec);

            pipe.run({
                name: 'hera',
                count: 6,
                status: true,
                nested: {
                    bluebird: 'present',
                    pinkbird: 'present',
                    branch: {
                        complex: 'present'
                    }
                }
            }, function(err, filtered) {
                must(err).be.null();
                must(filtered).eql({
                    name: 'HERA',
                    count: 16,
                    status: 'my status',
                    nested: {
                        bluebird: 'present',
                        pinkbird: 'present',
                        branch: {
                            complex: 'present'
                        }
                    }
                });
                done();
            });

        });

        it('should obey errors', function(done) {

            spec = {
                name: [
                    [upper]
                ],
                count: [
                    [pipeit],
                    [error, 'Some message'],
                    [inc, 10]
                ],
                status: [
                    [pipeit],
                    [pipeit],
                    [set, 'my status']
                ]

            };

            pipe = new Pipe(spec);

            pipe.run({
                name: 'hera',
                count: [1, 2, 3],
                status: true
            }, function(err, filtered) {
                must(err instanceof PipeError).be.true();
                must(err.errors).eql({
                    count: 'Some message'
                });
                done();
            });
        });

        it('should not run @after if things are not ok', function(done) {

            spec = {
                count: [
                    [pipeit],
                    [error, 'Some message'],
                    [inc, 10]
                ],
                '@after': [
                    [id]
                ]

            };

            var pipe = new Pipe(spec);

            pipe.run({
                count: 1
            }, function(err, filtered) {
                must(err instanceof PipeError).be.true();
                must(filtered).eql({});
                done();
            });
        })

        it('should run @after if things are ok', function(done) {

            spec = {
                count: [
                    [pipeit]
                ],
                '@after': [
                    [id]
                ]
            };

            var pipe = new Pipe(spec);

            pipe.run({
                count: 1
            }, function(err, filtered) {
                must(err).be.null();
                must(filtered).eql({
                    id: 100,
                    count: 1
                });
                done();
            });
        });

    });
})
