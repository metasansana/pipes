import must from 'must';
import Specification from '../src/Specification';

var s;
var spec = {
    name: [1, 2, 3],
    origin: [1],
    '?': ['?'],
    '@after': ['@after'],
    '*': ['*']
};
var b = [0, 1, 2, 3, 4, 5, 6];

describe('Specification', function() {

    describe('userKeys()', function() {

        it('should not return keyword keys', function() {

            s = new Specification(spec, {}, b);
            must(s.userKeys()).eql(['name', 'origin']);

        });

    });

    describe('keys()', function() {

        it('should not return any dupes or keyword keys', function() {

            s = new Specification(spec, {
                status: false,
                origin: 'h1',
                points: 24,
                name: 'Lo Bro',
            }, b);

            must(s.keys()).eql(['status', 'origin', 'points', 'name']);

        });


    });

    describe('after', function() {
        it('should return the @after work', function() {
            s = new Specification(spec, {}, b);
            must(s.after()).eql(['@after']);
        });

    });

    describe('all', function() {
        it('should return the * work', function() {
            s = new Specification(spec, {}, b);
            must(s.all()).eql(['*']);
        });

    });

    describe('unknown', function() {
        it('should return the ? work', function() {
            s = new Specification(spec, {}, b);
            must(s.unknown()).eql(['?']);
        });

    });

    describe('get', function() {

        beforeEach(function() {

            s = new Specification({
                name: [1, [1, 1, 1], 1],
                age: [2],
                other: [2, 3],
                '?': [3, [2, 2]],
                '*': [4, 5, 6]

            }, {
                name: 'Fu Fu',
                '@after': ['pp'],
                age: 1
            }, b);

        });

        it('should build the work up', function() {

            must(s.get('name')).eql([1, [1, 1, 1], 1, 4, 5, 6]);
            must(s.get('age')).eql([2, 4, 5, 6]);
            must(s.get('other')).eql([2, 3, 4, 5, 6]);

        });

    });

});
