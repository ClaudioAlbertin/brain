var assert    = require('chai').assert;
var brain     = require('../../lib/brain');
var Algorithm = require('../../lib/algorithm');

var utils             = brain.utils;
var Network           = brain.Network;
var LogisticCost      = brain.algorithms.LogisticCost;
var NumericalGradient = brain.algorithms.NumericalGradient;

describe('NumericalGradient', function () {
  var numericalGradient, network;

  var setup    = require('../setups/bad-xnor');
  var examples = utils.importExamples(setup.examples);
  var options  = {
    epsilon: 0.002
  };

  beforeEach(function () {
    network           = Network.fromJSON(setup);
    numericalGradient = new NumericalGradient(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(numericalGradient.network, network, 'instances match');
    });

    it('should set the given examples', function () {
      assert.deepEqual(numericalGradient.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(numericalGradient.options, options, 'options match');
    });

    it('should set a default cost algorithm', function () {
      assert.instanceOf(numericalGradient.cost, Algorithm, 'algorithm set');
    });

    it('should set default options', function () {
      assert.isObject(numericalGradient.options, 'object set');
    });
  });

  describe('create', function () {
    it('should return an instance of NumericalGradient', function () {
      assert.instanceOf(NumericalGradient.create(), NumericalGradient, 'is instance of NumericalGradient');
    });
  });

  describe('setCost', function () {
    var cost;

    beforeEach(function () {
      cost = new LogisticCost();
    });

    it('should set the given cost algorithm', function () {
      numericalGradient.setCost(cost);

      assert.strictEqual(numericalGradient.cost, cost, 'instances match');
    });

    it('should keep the present cost algorithm if no algorithm is given', function () {
      numericalGradient.setCost(cost);
      numericalGradient.setCost();

      assert.strictEqual(numericalGradient.cost, cost, 'instances match');
    });
  });

  describe('computeError', function () {
    it('should return the error of the weights', function () {
      var error = numericalGradient.computeError(utils.randomWeights(network.layers));

      assert.isNumber(error, 'error is a number');
      assert.operator(error, '>', 0, 'error is larger than 0');
    });

    it('should use the given weights to compute the error', function () {
      var firstRun  = numericalGradient.computeError(utils.randomWeights(network.layers));
      var secondRun = numericalGradient.computeError(utils.randomWeights(network.layers));

      assert.notEqual(firstRun, secondRun, 'errors are different, as expected');
    });
  });

  describe('run', function () {
    it('should return an array of matrices with the same dimensions as the weights', function () {
      var derivatives = numericalGradient.run();

      assert.isTrue(network.validateWeights(derivatives), 'dimensions match');
    });

    it('should not return an array of matrices of 0', function () {
      var derivatives = numericalGradient.run();
      var zero        = utils.zeroWeights(network.layers);

      assert.notDeepEqual(derivatives, zero, 'result is not 0');
    });
  });
});
