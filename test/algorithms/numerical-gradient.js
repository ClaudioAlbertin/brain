var assert    = require('chai').assert
  , brain     = require('../../lib/brain')
  , Algorithm = require('../../lib/algorithm');

var utils             = brain.utils
  , Network           = brain.Network
  , LogisticCost      = brain.algorithms.LogisticCost
  , NumericalGradient = brain.algorithms.NumericalGradient;

describe('NumericalGradient', function () {
  var numericalGradient
    , network
    , setup
    , examples
    , options;

  before(function () {
    setup    = require('../setups/bad-xnor');
    examples = utils.importExamples(setup.examples);

    options  = {
      epsilon: 0.002
    };
  });

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
      var firstRun  = numericalGradient.computeError(utils.randomWeights(network.layers))
        , secondRun = numericalGradient.computeError(utils.randomWeights(network.layers));

      assert.notEqual(firstRun, secondRun, 'errors are different, as expected');
    });
  });

  describe('run', function () {
    var derivatives;

    before(function () {
      derivatives = numericalGradient.run();
    });

    it('should return an array of matrices with the same dimensions as the weights', function () {
      assert.isTrue(network.validateWeights(derivatives), 'dimensions match');
    });

    it('should not return an array of matrices of 0', function () {
      var zero = utils.zeroWeights(network.layers);

      assert.notDeepEqual(derivatives, zero, 'result is not 0');
    });
  });
});
