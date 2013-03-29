var assert    = require('chai').assert
  , brain     = require('../lib/brain')
  , Algorithm = require('../lib/algorithm');

var utils   = brain.utils
  , Network = brain.Network;

describe('Algorithm', function () {
  var algorithm
    , network
    , setup
    , examples
    , options;

  before(function () {
    setup    = require('./setups/xnor');
    examples = utils.importExamples(setup.examples);
    options  = {
      a: 1,
      b: 2,
      c: 3
    };
  });

  beforeEach(function () {
    network   = Network.fromJSON(setup);
    algorithm = new Algorithm(network);
  });

  describe('constructor', function () {
    it('should set an empty array of examples', function () {
      assert.isArray(algorithm.examples, 'examples array set');
    });

    it('should set an empty object of options', function () {
      assert.isObject(algorithm.options, 'options object set');
    });

    it('should set an object of reporters', function () {
      assert.isObject(algorithm.reporters, 'reporters object set');
    });

    it('should set the given network', function () {
      assert.deepEqual(algorithm.network, network, 'instances match');
    });

    it('should set the given examples', function () {
      var algorithm = new Algorithm(null, examples);

      assert.deepEqual(algorithm.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      var algorithm = new Algorithm(null, null, options);

      assert.deepEqual(algorithm.options, options, 'options match');
    });
  });

  describe('addReporter', function () {
    it('should add reporter to the given event', function () {
      algorithm.addReporter('test', console.log);

      assert.include(algorithm.reporters.test, console.log, 'reporter added');
    });

    it('should add reporter to the "all" event if no event is given', function () {
      algorithm.addReporter(console.log);

      assert.include(algorithm.reporters.all, console.log, 'reporter added');
    });

    it('should not add any element if no reporter is given', function () {
      algorithm.addReporter('test');
      algorithm.addReporter();

      assert.deepEqual(algorithm.reporters, { all: [] }, 'no reporter added, as expected');
    });
  });

  describe('setNetwork', function () {
    it('should set the given network', function () {
      algorithm.setNetwork(network);

      assert.deepEqual(algorithm.network, network, 'instances match');
    });

    it('should not override the present network if no network is given', function () {
      algorithm.setNetwork(network);
      algorithm.setNetwork();

      assert.deepEqual(algorithm.network, network, 'instances match');
    });

    it('should create a clone of the given network', function () {
      algorithm.setNetwork(network);

      assert.notStrictEqual(algorithm.network, network, 'instances do not match strictly');
    });
  });

  describe('setExamples', function () {
    it('should set the given examples', function () {
      algorithm.setExamples(examples);

      assert.deepEqual(algorithm.examples, examples, 'examples match');
    });

    it('should not override the present examples if no examples are given', function () {
      algorithm.setExamples(examples);
      algorithm.setExamples();

      assert.deepEqual(algorithm.examples, examples, 'examples match');
    });
  });

  describe('setOptions', function () {
    it('should set the given options', function () {
      algorithm.setOptions(options);

      assert.deepEqual(algorithm.options, options, 'options match');
    });

    it('should override options that are redefined in the given object', function () {
      algorithm.setOptions(options);
      algorithm.setOptions({ a: 2 });

      assert.equal(algorithm.options.a, 2, 'option redefined');
    });

    it('should keep options that are not redefined in the given object', function () {
      algorithm.setOptions(options);
      algorithm.setOptions({ a: 2 });

      assert.propertyVal(algorithm.options, 'b', options.b, 'option kept');
      assert.propertyVal(algorithm.options, 'c', options.c, 'option kept');
    });
  });

  describe('report', function () {
    it('should call all assigned reporters for the given event', function (done) {
      var called = false;

      algorithm.addReporter('test', function () {
        called = true;
      });

      algorithm.report('test');

      process.nextTick(function () {
        assert.isTrue(called, 'reporter called');
        done();
      });
    });

    it('should call all assigned reporters for the "all" event for any given event', function (done) {
      var called = false;

      algorithm.addReporter(function () {
        called = true;
      });

      algorithm.report('test');

      process.nextTick(function () {
        assert.isTrue(called, 'reporter called');
        done();
      });
    });

    it('should give the event name and the reported data to the assigned reporters', function (done) {
      var report = {
        a: 1,
        b: 2,
        c: 3
      };

      algorithm.addReporter(function (event, data) {
        assert.strictEqual(event, 'test', 'event matches');
        assert.deepEqual(data, report, 'data matches');

        done();
      });

      algorithm.report('test', report);
    });
  });

  describe('run', function () {
    it('should throw an error that it has to be implemented first', function () {
      assert.throws(algorithm.run, Error);
    });
  });
});
