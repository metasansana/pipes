import must from 'must';
import HiddenEventSource from '../src/HiddenEventSource';

var source;

beforeEach(function() {

    source = new HiddenEventSource();

});

describe('HiddenEventSource', function() {
    describe('on', function() {
        it('should not register a callback more than once', function() {
            var cb = function() {};
            source.on('x', cb);
            source.on('x', cb);
            must(source._events.x.length).equal(1);
        });

    });

    describe('once', function() {
        it('should remove an event after firing', function() {

            var cb = function() {};
            source.once('x', cb);
            source.emit('x');
            must(source._events.x.length).equal(0);

        });
    });

});
