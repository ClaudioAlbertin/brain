var assert = require('chai').assert;
var brain  = require('../../lib/brain');

var utils             = brain.utils;
var Network           = brain.Network;
var NumericalGradient = brain.algorithms.NumericalGradient;
var BackPropagation   = brain.algorithms.BackPropagation;

describe('BackPropagation', function () {
  var backPropagation, network;

  var setup    = require('../setups/bad-xnor');
  var examples = utils.importExamples(setup.examples);
  var options  = {
    delta: utils.zeroWeights(setup.layers)
  };

  beforeEach(function () {
    network         = Network.fromJSON(setup);
    backPropagation = new BackPropagation(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(backPropagation.network, network, 'instances match');
    });

    it('should set the given examples', function () {
      assert.deepEqual(backPropagation.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(backPropagation.options, options, 'options match');
    });
  });

  describe('create', function () {
    it('should return an instance of BackPropagation', function () {
      assert.instanceOf(BackPropagation.create(), BackPropagation, 'is instance of BackPropagation');
    });
  });

  describe('run', function () {
    it('should return an array of matrices with the same dimensions as the weights', function () {
      var derivatives = backPropagation.run();

      assert.isTrue(network.validateWeights(derivatives), 'dimensions match');
    });

    it('should not return an array of matrices of 0', function () {
      var derivatives = backPropagation.run();
      var zero        = utils.zeroWeights(network.layers);

      assert.notDeepEqual(derivatives, zero, 'result is not 0');
    });

    it('should compute similar values as the numerical estimation using NumericalGradient', function () {
      var numericalGradient = new NumericalGradient(network, examples);

      var result   = backPropagation.run();
      var estimate = numericalGradient.run();

      var i, l, j, m, k, n;

      for (i = 0, l = result.length; i < l; i++) {
        for (j = 0, m = result[i].elements.length; j < m; j++) {
          for (k = 0, n = result[i].elements[j].length; k < n; k++) {
            assert.closeTo(result[i].elements[j][k], estimate[i].elements[j][k], 1e-6, 'close to numerical estimate');
          }
        }
      }
    });
  });
});
