var assert = require('chai').assert
  , brain  = require('../../lib/brain');

var utils      = brain.utils
  , Network    = brain.Network
  , LinearCost = brain.algorithms.LinearCost;

describe('LinearCost', function () {
  var network
    , linearCost
    , setup
    , examples
    , options;

  before(function () {
    setup    = require('../setups/xnor');
    examples = utils.importExamples(setup.examples);

    options  = {
      regularization: 2
    };
  });

  beforeEach(function () {
    network    = Network.fromJSON(setup);
    linearCost = new LinearCost(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(linearCost.network, network, 'network matches');
    });

    it('should set the given examples', function () {
      assert.deepEqual(linearCost.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(linearCost.options, options, 'options match');
    });
  });

  describe('run', function () {
    var result;

    before(function () {
      result = linearCost.run();
    });

    it('should return a realistic error value', function () {
      assert.isNumber(result, 'result is number');
      assert.operator(result, '>', 0, 'error is bigger than 0');
    });
  });
});
