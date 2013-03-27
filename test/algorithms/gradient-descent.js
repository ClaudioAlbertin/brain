var assert    = require('chai').assert
  , brain     = require('../../lib/brain')
  , Algorithm = require('../../lib/algorithm');

var utils     = brain.utils
  , sylvester = brain.sylvester;

var Matrix = sylvester.Matrix;

var Network         = brain.Network
  , GradientDescent = brain.algorithms.GradientDescent
  , LogisticCost    = brain.algorithms.LogisticCost
  , BackPropagation = brain.algorithms.BackPropagation;


describe('GradientDescent', function () {
  var network
    , gradientDescent
    , setup
    , examples
    , options;

  before(function () {
  // load xnor with random weights
    setup    = require('../setups/bad-xnor');
    examples = utils.importExamples(setup.examples);

    options  = {
      reportFrequency : 50,
      learningRate    : 1,
      targetError     : 0.2,
      iterations      : 5000,
      minimalSpeed    : 0
    };
  });

  beforeEach(function () {
    network         = Network.fromJSON(setup);
    gradientDescent = new GradientDescent(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(gradientDescent.network, network, 'network matches');
    });

    it('should set the given examples', function () {
      assert.deepEqual(gradientDescent.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(gradientDescent.options, options, 'options match');
    });

    it('should set a default cost algorithm', function () {
      assert.instanceOf(gradientDescent.cost, Algorithm, 'algorithm set');
    });

    it('should set a default derivative algorithm', function () {
      assert.instanceOf(gradientDescent.derivative, Algorithm, 'algorithm set');
    });

    it('should set default options', function () {
      var gradientDescent = new GradientDescent();

      assert.isObject(gradientDescent.options, 'options set');
    });
  });

  describe('create', function () {
    it('should return an instance of GradientDescent', function () {
      assert.instanceOf(GradientDescent.create(), GradientDescent, 'is instance of GradientDescent');
    });
  });

  describe('setCost', function () {
    it('should set the cost given algorithm', function () {
      var cost = new LogisticCost();
      gradientDescent.setCost(cost);

      assert.strictEqual(gradientDescent.cost, cost, 'instances match');
    });

    it('should keep the already set algorithm if no algorithm is given', function () {
      var cost = gradientDescent.cost;
      gradientDescent.setCost();

      assert.strictEqual(gradientDescent.cost, cost, 'instances match');
    });
  });

  describe('setDerivative', function () {
    it('should set a cost given function', function () {
      var derivative = new BackPropagation();
      gradientDescent.setDerivative(derivative);

      assert.strictEqual(gradientDescent.derivative, derivative, 'instances match');
    });

    it('should keep the already set algorithm if no algorithm is given', function () {
      var derivative = gradientDescent.derivative;
      gradientDescent.setDerivative();

      assert.strictEqual(gradientDescent.derivative, derivative, 'instances match');
    });
  });

  describe('scaleDerivative', function () {
    var derivative
      , scaledDerivative;

    before(function () {
      derivative = Matrix.create([
        [1, 2, 3],
        [2, 3, 4]
      ]);

      scaledDerivative = Matrix.create([
        [2, 4, 6],
        [4, 6, 8]
      ]);
    });

    it('should scale derivatives correctly', function () {
      var result = gradientDescent
        .setOptions({ learningRate: 2 })
        .scaleDerivative(derivative);

      assert.deepEqual(result, scaledDerivative, 'derivatives match');
    });
  });

  describe('computeError', function () {
    it('should return the error of the weights', function () {
      var error = gradientDescent.computeError(utils.randomWeights(network.layers));

      assert.isNumber(error, 'error is a number');
      assert.operator(error, '>', 0, 'error is larger than 0');
    });

    it('should use the given weights to compute the error', function () {
      var firstRun  = gradientDescent.computeError(utils.randomWeights(network.layers))
        , secondRun = gradientDescent.computeError(utils.randomWeights(network.layers));

      assert.notEqual(firstRun, secondRun, 'errors are different, as expected');
    });
  });

  describe('run', function () {
    var weights
      , optimizedWeights;

    before(function () {
      weights          = utils.randomWeights(network.layers);
      optimizedWeights = gradientDescent
        .setNetwork(network.setWeights(weights))
        .run();
    });

    it('should return updated weights', function () {
      assert.notDeepEqual(optimizedWeights, weights, 'weights are updated');
    });

    it('should return weights with a smaller error', function () {
      assert.operator(gradientDescent.computeError(optimizedWeights), '<', gradientDescent.computeError(network.weights), 'error has decreased');
    });

    it('should stop if the given limit of iterations is achieved', function (done) {
      // set target error that is impossible to achieve
      var options = {
        iterations  : 100,
        targetError : 0
      };

      gradientDescent.setOptions(options);

      gradientDescent.addReporter('finished-optimization', function (event, data) {
        assert.equal(data.iterations, options.iterations, 'iterations match');

        done();
      });

      gradientDescent.run();
    });

    it('should stop if the error of the weights is below the threshold', function () {
      var options
        , errors;

      options = {
        iterations  : Infinity,
        targetError : 0.4
      };

      errors = [];

      gradientDescent.setOptions(options);

      gradientDescent.addReporter('optimization', function (event, data) {
        errors.push(data.error);
      });

      gradientDescent.run();

      // second last error is expected to be over the threshold
      assert.operator(errors[errors.length - 2], '>', options.targetError);
    });
  });
});
