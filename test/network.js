var assert = require('chai').assert
  , brain  = require('../lib/brain');

var sylvester = brain.sylvester
  , utils     = brain.utils;

var Network = brain.Network
  , Vector  = sylvester.Vector;

describe('Network', function () {
  var setup
    , layers
    , weights
    , examples
    , network;

  before(function () {
    setup    = require('./setups/xnor');
    layers   = setup.layers;
    weights  = utils.importWeights(setup.weights);
    examples = utils.importExamples(setup.examples);
  });

  beforeEach(function () {
    network = Network.fromJSON(setup);
  });

  describe('constructor', function () {
    beforeEach(function () {
      network = new Network(layers, weights);
    });

    it('should set the given layers', function () {
      assert.deepEqual(network.layers, layers, 'layers match');
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
    it('should set the given weights', function () {
      network.setWeights(weights);

      assert.deepEqual(network.weights, weights, 'weights match');
    });

    it('should throw an exception if the given weights are invalid', function () {
      var weights = utils.randomWeights([3, 2, 3]);

      assert.throws(function () {
        network.setWeights(weights);
      }, Error);
    });
  });

  describe('setActivation', function () {
    var activation;

    before(function () {
      activation = function (x) {
        return x;
      };
    });

    it('should set the activation function', function () {
      network.setActivation(activation);

      assert.isFunction(network.activation, 'function is set');
      assert.strictEqual(network.activation, activation, 'functions match');
    });

    it('should do keep present activation function if no function is given', function () {
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
      var example
        , output
        , i;

      // iterate over given inputs
      for (i = 0; example = examples[i]; i++) {
        output = network.run(example.input);

        assert.deepEqual(output.round(), example.output, 'outputs match');
      }
    });
  });

  describe('propagate', function () {
    var hypothesis;

    before(function () {
      hypothesis = network.propagate(examples[0].input);
    });

    it('should return an array of vectors with correct dimensions', function () {
      var i
        , l;

      assert.strictEqual(hypothesis.length, layers.length, 'network dimensions match');

      for (i = 0, l = layers.length; i < l; i++) {
        assert.instanceOf(hypothesis[i].raw, Vector, 'raw output is a vector');
        assert.instanceOf(hypothesis[i].values, Vector, 'processed output is a vector');
        assert.strictEqual(hypothesis[i].raw.dimensions().cols, layers[i], 'dimensions of raw output of layer ' + i + ' match');
        assert.strictEqual(hypothesis[i].values.dimensions().cols, layers[i], 'dimensions of processed output of layer ' + i + ' match');
      }
    });
  });

  describe('clone', function () {
    var clone;

    beforeEach(function () {
      clone = network.clone();
    });

    it('should return a new instance', function () {
      assert.notStrictEqual(clone, network, 'instances do not match');
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


