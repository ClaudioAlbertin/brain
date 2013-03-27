var assert = require('chai').assert
  , brain  = require('../../lib/brain');

var utils          = brain.utils
  , Network        = brain.Network
  , Training       = brain.Training
  , TrainingResult = brain.Training.Result;

describe('TrainingResult', function () {
  var training
    , result
    , network
    , setup
    , weights;

  before(function () {
    setup   = require('../setups/xnor');
    weights = utils.randomWeights(setup.layers);
  });

  beforeEach(function () {
    network  = Network.fromJSON(setup);
    training = new Training(network);
    result   = new TrainingResult(training, weights);
  });

  describe('constructor', function () {
    it('should set the given training', function () {
      assert.strictEqual(result.training, training, 'instances match');
    });

    it('should set the given weights', function () {
      assert.deepEqual(result.weights, weights, 'weights match');
    });
  });

  describe('getNetwork', function () {
    var network;

    beforeEach(function () {
      network = result.getNetwork();
    });

    it('should return a network', function () {
      assert.instanceOf(network, Network, 'is instance of Network');
    });

    it('should return a network with the weights from the training', function () {
      assert.deepEqual(network.weights, weights, 'weights match');
    });
  });

  describe('getError', function () {
    it('should return the error of the weights', function () {
      assert.isNumber(result.getError());
    });
  });

  describe('getWeights', function () {
    it('should return the weights', function () {
      assert.deepEqual(result.getWeights(), weights, 'weights match');
    });
  });
});
