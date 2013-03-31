var assert = require('chai').assert
  , brain  = require('../../lib/brain');

var utils      = brain.utils
  , Network    = brain.Network
  , SquaredError = brain.algorithms.SquaredError;

describe('SquaredError', function () {
  var network
    , squaredError
    , setup
    , examples
    , options;

  before(function () {
    setup    = require('../setups/bad-xnor');
    examples = utils.importExamples(setup.examples);

    options  = {
      reportFrequency : 5,
      regularization  : 2
    };
  });

  beforeEach(function () {
    network    = Network.fromJSON(setup);
    squaredError = new SquaredError(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(squaredError.network, network, 'network matches');
    });

    it('should set the given examples', function () {
      assert.deepEqual(squaredError.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(squaredError.options, options, 'options match');
    });
  });

  describe('run', function () {
    var result;

    before(function () {
      result = squaredError.run();
    });

    it('should return a realistic error value', function () {
      assert.isNumber(result, 'result is number');
      assert.operator(result, '>', 0, 'error is bigger than 0');
    });
  });
});
