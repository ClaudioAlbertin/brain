var assert    = require('chai').assert
  , brain     = require('../../lib/brain')
  , Algorithm = require('../../lib/algorithm');

var utils           = brain.utils
  , Network         = brain.Network
  , Training        = brain.Training
  , TrainingResult  = brain.Training.Result
  , LogisticCost    = brain.algorithms.LogisticCost
  , BackPropagation = brain.algorithms.BackPropagation
  , GradientDescent = brain.algorithms.GradientDescent;

describe('Training', function () {
  var training
    , setup
    , examples
    , network;

  before(function () {
    setup    = require('../setups/xnor');
    examples = utils.importExamples(setup.examples);
  });

  beforeEach(function () {
    training = new Training();
    network  = Network.fromJSON(setup);
  });

  describe('constructor', function () {
    var training
      , cost
      , derivative
      , optimization;

    beforeEach(function () {
      network      = Network.fromJSON(setup);
      cost         = new LogisticCost();
      derivative   = new BackPropagation();
      optimization = new GradientDescent();
      training     = new Training(network, cost, derivative, optimization);
    });

    it('should set the given network', function () {
      assert.strictEqual(training.network, network, 'instances match');
    });

    it('should set the given cost algorithm', function () {
      assert.strictEqual(training.cost, cost, 'instancesmatch');
    });

    it('should set the given derivative algorithm', function () {
      assert.strictEqual(training.derivative, derivative, 'instances match');
    });

    it('should set the given optimization algorithm', function () {
      assert.strictEqual(training.optimization, optimization, 'instances match');
    });

    it('should set a default derivative algorithm', function () {
      assert.instanceOf(training.derivative, Algorithm, 'algorithm set');
    });

    it('should set a default cost algorithm', function () {
      assert.instanceOf(training.cost, Algorithm, 'algorithm set');
    });

    it('should set a default optimization algorithm', function () {
      assert.instanceOf(training.optimization, Algorithm, 'algorithm set');
    });
  });

  describe('setNetwork', function () {
    it('should set the given network', function () {
      training.setNetwork(network);

      assert.strictEqual(training.network, network, 'instances match');
    });
  });

  describe('setCost', function () {
    var cost;

    beforeEach(function () {
      cost = new LogisticCost();
    });

    it('should set the given cost algorithm', function () {
      training.setCost(cost);

      assert.strictEqual(training.cost, cost, 'instances match');
    });

    it('should keep the already set algorithm if no algorithm is given', function () {
      training.setCost(cost);
      training.setCost();

      assert.strictEqual(training.cost, cost, 'instances match');
    });
  });

  describe('setOptimization', function () {
    var optimization;

    beforeEach(function () {
      optimization = new GradientDescent();
    });

    it('should set the given optimization algorithm', function () {
      training.setOptimization(optimization);

      assert.strictEqual(training.optimization, optimization, 'instances match');
    });

    it('should keep the already set algorithm if no algorithm is given', function () {
      training.setOptimization(optimization);
      training.setOptimization();

      assert.strictEqual(training.optimization, optimization, 'instances match');
    });
  });

  describe('setDerivative', function () {
    var derivative;

    beforeEach(function () {
      derivative = new BackPropagation();
    });

    it('should set the derivative given algorithm', function () {
      training.setDerivative(derivative);

      assert.strictEqual(training.derivative, derivative, 'instances match');
    });

    it('should keep the already set algorithm if no algorithm is given', function () {
      training.setDerivative(derivative);
      training.setDerivative();

      assert.strictEqual(training.derivative, derivative, 'instances match');
    });
  });

  describe('setExamples', function () {
    it('should set the given examples', function () {
      training.setExamples(examples);

      assert.deepEqual(training.examples, examples, 'examples match');
    });

    it('should not override the present examples if no examples are given', function () {
      training.setExamples(examples);
      training.setExamples();

      assert.deepEqual(training.examples, examples, 'examples match');
    });
  });

  describe('run', function () {
    it('should return an instance of TrainingResult', function () {
      var result  = training.setNetwork(network).run(examples);

      assert.instanceOf(result, TrainingResult, 'is instance of TrainingResult');
    });
  });
});
