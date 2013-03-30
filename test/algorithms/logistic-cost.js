var assert = require('chai').assert
  , brain  = require('../../lib/brain');

var utils        = brain.utils
  , Network      = brain.Network
  , LogisticCost = brain.algorithms.LogisticCost;

describe('LogisticCost', function () {
  var network
    , logisticCost
    , setup
    , examples
    , options;

  before(function () {
    setup    = require('../setups/xnor');
    examples = utils.importExamples(setup.examples);

    options  = {
      reportFrequency : 5,
      regularization  : 2
    };
  });

  beforeEach(function () {
    network      = Network.fromJSON(setup);
    logisticCost = new LogisticCost(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(logisticCost.network, network, 'network matches');
    });

    it('should set the given examples', function () {
      assert.deepEqual(logisticCost.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(logisticCost.options, options, 'options match');
    });
  });

  describe('run', function () {
    var result;

    before(function () {
      result = logisticCost.run();
    });

    it('should return a realistic error value', function () {
      assert.isNumber(result, 'result is number');
      assert.operator(result, '>', 0, 'error is bigger than 0');
    });
  });
});
