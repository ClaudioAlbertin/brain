var assert = require('chai').assert
  , brain  = require('../../lib/brain');

var utils             = brain.utils
  , Network           = brain.Network
  , NumericalGradient = brain.algorithms.NumericalGradient
  , BackPropagation   = brain.algorithms.BackPropagation;

describe('BackPropagation', function () {
  var backPropagation
    , network
    , setup
    , examples
    , options;

  before(function () {
    setup    = require('../setups/bad-xnor');
    examples = utils.importExamples(setup.examples);

    options  = {
      delta           : utils.zeroWeights(setup.layers),
      regularization  : 0,
      reportFrequency : 5
    };
  });

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

  describe('run', function () {
    var derivatives;

    before(function () {
      derivatives = backPropagation.run();
    });

    it('should return an array of matrices with the same dimensions as the weights', function () {
      assert.isTrue(network.validateWeights(derivatives), 'dimensions match');
    });

    it('should not return an array of matrices of 0', function () {
      var zero = utils.zeroWeights(network.layers);

      assert.notDeepEqual(derivatives, zero, 'result is not 0');
    });

    it('should compute similar values as the numerical estimation using NumericalGradient', function () {
      var numericalGradient
        , estimate
        , i
        , l
        , j
        , m
        , k
        , n;

      numericalGradient = new NumericalGradient(network, examples);
      estimate          = numericalGradient.run();

      for (i = 0, l = derivatives.length; i < l; i++) {
        for (j = 0, m = derivatives[i].elements.length; j < m; j++) {
          for (k = 0, n = derivatives[i].elements[j].length; k < n; k++) {
            assert.closeTo(derivatives[i].elements[j][k], estimate[i].elements[j][k], 1e-6, 'close to numerical estimate');
          }
        }
      }
    });
  });
});
