var assert    = require('chai').assert;
var sylvester = require('sylvester');
var brain     = require('../lib/brain');
var utils     = require('../lib/utils');

var Perceptron = brain.networks.Perceptron;
var Matrix     = sylvester.Matrix;
var Vector     = sylvester.Vector;

describe('Perceptron', function () {
  var perceptron, layers, weights, inputs, expectedOutputs;

  beforeEach(function () {
    // layers, inputs, outputs and weights for XNOR
    layers = [2, 2, 1];

    inputs = [
      Vector.create([0, 1]),
      Vector.create([1, 0]),
      Vector.create([0, 0]),
      Vector.create([1, 1])
    ];

    expectedOutputs = [
      Vector.create([0]),
      Vector.create([0]),
      Vector.create([1]),
      Vector.create([1])
    ];

    weights = [
      Matrix.create([
        [-30, 20, 20],
        [10, -20, -20]
      ]),
      Matrix.create([
        [-10, 20, 20]
      ])
    ];

    perceptron = new Perceptron(layers, weights);
  });

  describe('constructor', function () {
    it('should set layers', function () {
      assert.strictEqual(perceptron.layers, layers, 'layers match');
    });

    it('should set weights if given', function () {
      assert.strictEqual(perceptron.weights, weights, 'weights match');
    });

    it('should set a default activation function', function () {
      assert.isFunction(perceptron.activation, 'function is set');
    });
  });

  describe('setWeights', function () {
    it('should set weights', function () {
      perceptron.setWeights(weights);

      assert.strictEqual(perceptron.weights, weights, 'weights match');
    });

    it('should throw an exception if weights are invalid', function () {
      var weights = utils.randomWeights([3, 2, 3]);

      assert.throws(function () {
        perceptron.setWeights(weights);
      }, Error, 'Dimension mismatch of given weights', 'throws error');
    });
  });

  describe('setActivationFunction', function () {
    it('should set the activation function', function () {
      var activation = function (x) {
        return x;
      };

      perceptron.setActivationFunction(activation);

      assert.isFunction(perceptron.activation, 'function is set');
      assert.strictEqual(perceptron.activation, activation, 'functions match');
    });

    it('should do nothing if no function is given', function () {
      var activation = perceptron.activation;

      perceptron.setActivationFunction();

      assert.isFunction(perceptron.activation, 'function is set');
      assert.strictEqual(perceptron.activation, activation, 'functions match');
    });
  });

  describe('validateWeights', function () {
    it('should return true when a correct input is given', function () {
      assert.isTrue(perceptron.validateWeights(weights), 'return value is true');
    });

    it('should detect a dimension mismatch', function () {
      var weights = utils.randomWeights([3, 2, 3]);

      assert.isFalse(perceptron.validateWeights(weights), 'return value is false');
    });
  });

  describe('run', function () {
    it('should compute correctly', function (done) {
      var l = inputs.length;

      // computes outputs and registers assertions for a given set of inputs and expected outputs
      var run = function (i) {
        perceptron.run(inputs[i], function (err, outputs) {
          if (err) throw err;

          assert.isTrue(outputs.round().eql(expectedOutputs[i]), 'outputs match');

          // call `done` if this is the last run
          if (i === l - 1) done();
        });
      };

      // iterates over given inputs
      for (var i = 0; i < l; i++) run(i);
    });
  });

  describe('propagate', function () {
    it('should return an array of vectors with correct dimensions', function (done) {
      perceptron.propagate(inputs[0], function (err, outputs) {
        if (err) throw err;

        assert.strictEqual(outputs.length, layers.length, 'network dimensions match');

        for (var i = 0, l = layers.length; i < l; i++) {
          assert.instanceOf(outputs[i], Vector, 'output is a vector');
          assert.strictEqual(outputs[i].dimensions().cols, layers[i], 'dimensions of layer ' + i + ' match');
        }

        done();
      });
    });
  });
});
