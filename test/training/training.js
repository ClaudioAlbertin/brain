var assert    = require('chai').assert;
var brain     = require('../../lib/brain');
var Algorithm = require('../../lib/algorithm');

var utils           = brain.utils;
var Network         = brain.Network;
var Training        = brain.Training;
var TrainingResult  = brain.Training.Result;
var LogisticCost    = brain.algorithms.LogisticCost;
var BackPropagation = brain.algorithms.BackPropagation;
var GradientDescent = brain.algorithms.GradientDescent;

describe('Training', function () {
  var training;

  var setup    = require('../setups/xnor');
  var examples = utils.importExamples(setup.examples);

  beforeEach(function () {
    training = new Training();
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      var network  = Network.fromJSON(setup);
      var training = new Training(network);

      assert.strictEqual(training.network, network, 'instances match');
    });

    it('should set the given cost algorithm', function () {
      var cost     = new LogisticCost();
      var training = new Training(null, cost);

      assert.strictEqual(training.cost, cost, 'instancesmatch');
    });

    it('should set the given derivative algorithm', function () {
      var derivative = new BackPropagation();
      var training   = new Training(null, null, derivative);

      assert.strictEqual(training.derivative, derivative, 'instances match');
    });

    it('should set the given optimization algorithm', function () {
      var optimization = new GradientDescent();
      var training     = new Training(null, null, null, optimization);

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
    var network;

    beforeEach(function () {
      network = Network.fromJSON(setup);
    });

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
      var network = Network.fromJSON(setup);
      var result  = training.setNetwork(network).run(examples);

      assert.instanceOf(result, TrainingResult, 'is instance of TrainingResult');
    });
  });
});
