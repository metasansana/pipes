import must from 'must';
import WorkBuilder from '../src/WorkBuilder';

var builder;

describe('WorkBuilder', function() {

    describe('build()', function() {

        it('should build', function() {
            builder = new WorkBuilder({
                name: [1, [1, 1, 1], 1],
                age: [2],
                other: [2, 3],
                '?': [3, [2, 2]],
                '*': [4, 5, 6]

            }, {
                name: 'Fu Fu',
                '@after': ['pp'],
                age: 1,
                other: 'x',
                status: false
            }, {});

            must(builder.build()).eql({

                name: [1, [1, 1, 1], 1, 4, 5, 6, ],
                '@after': null,
                age: [2, 4, 5, 6],
                other: [2, 3, 4, 5, 6],
                status: [3, [2, 2, ], 4, 5, 6]

            });
        });

        it('should build keys that are not set', function() {
            builder = new WorkBuilder({
                name: [1, [1, 1, 1], 1],
                age: [2],
                other: [2, 3]

            }, {
                name: 'Fu Fu',
                age: 1,
                status: false
            }, {});

            must(builder.build()).eql({

                name: [1, [1, 1, 1], 1],
                age: [2],
                other: [2, 3],
                status: null

            });
        });

    });

});
