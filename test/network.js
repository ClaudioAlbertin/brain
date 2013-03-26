var assert = require('chai').assert;
var brain  = require('../lib/brain');

var sylvester = brain.sylvester;
var utils     = brain.utils;

var Network = brain.Network;
var Vector  = sylvester.Vector;

describe('Network', function () {
  var network;

  var setup    = require('./setups/xnor');
  var layers   = setup.layers;
  var weights  = utils.importWeights(setup.weights);
  var examples = utils.importExamples(setup.examples);

  beforeEach(function () {
    network = Network.fromJSON(setup);
  });

  describe('constructor', function () {
    it('should set the given layers', function () {
      assert.strictEqual(network.layers, layers, 'layers match');
    });

    it('should set the given weights', function () {
      assert.deepEqual(network.weights, weights, 'weights match');
    });

    it('should set a default activation function', function () {
      assert.isFunction(network.activation, 'function is set');
    });
  });

  describe('fromJSON', function () {
    it('should import layers correctly', function () {
      assert.strictEqual(network.layers, layers, 'layers match');
    });

    it('should import weights correctly', function () {
      assert.deepEqual(network.weights, weights);
    });
  });

  describe('setWeights', function () {
    it('should set weights', function () {
      network.setWeights(weights);

      assert.deepEqual(network.weights, weights, 'weights match');
    });

    it('should throw an exception if weights are invalid', function () {
      var weights = utils.randomWeights([3, 2, 3]);

      assert.throws(function () {
        network.setWeights(weights);
      }, Error, 'Dimension mismatch of given weights', 'throws error');
    });
  });

  describe('setActivation', function () {
    it('should set the activation function', function () {
      var activation = function (x) {
        return x;
      };

      network.setActivation(activation);

      assert.isFunction(network.activation, 'function is set');
      assert.strictEqual(network.activation, activation, 'functions match');
    });

    it('should do nothing if no function is given', function () {
      var activation = network.activation;

      network.setActivation();

      assert.isFunction(network.activation, 'function is set');
      assert.strictEqual(network.activation, activation, 'functions match');
    });
  });

  describe('validateWeights', function () {
    it('should return true when a correct input is given', function () {
      assert.isTrue(network.validateWeights(weights), 'return value is true');
    });

    it('should detect a dimension mismatch', function () {
      var weights = utils.randomWeights([3, 2, 3]);

      assert.isFalse(network.validateWeights(weights), 'return value is false');
    });
  });

  describe('run', function () {
    it('should compute correctly', function () {
      var i, example, output;

      // iterate over given inputs
      for (i = 0; example = examples[i]; i++) {
        output = network.run(example.input);

        assert.deepEqual(output.round(), example.output, 'outputs match');
      }
    });
  });

  describe('propagate', function () {
    it('should return an array of vectors with correct dimensions', function () {
      var output = network.propagate(examples[0].input);
      var i, l;

      assert.strictEqual(output.length, layers.length, 'network dimensions match');

      for (i = 0, l = layers.length; i < l; i++) {
        assert.instanceOf(output[i].raw, Vector, 'raw output is a vector');
        assert.instanceOf(output[i].values, Vector, 'processed output is a vector');
        assert.strictEqual(output[i].raw.dimensions().cols, layers[i], 'dimensions of raw output of layer ' + i + ' match');
        assert.strictEqual(output[i].values.dimensions().cols, layers[i], 'dimensions of processed output of layer ' + i + ' match');
      }
    });
  });

  describe('clone', function () {
    var clone;

    beforeEach(function () {
      clone = network.clone();
    });

    it('should return a different instance', function () {
      assert.notStrictEqual(clone, network, 'instances are different');
    });

    it('should avoid changes of the original weights array', function () {
      // change weights by multiplying
      clone.weights.map(function (x) {
        return x.multiply(2);
      });

      assert.notStrictEqual(clone.weights, network.weights, 'weights not changed');
    });
  });
});


