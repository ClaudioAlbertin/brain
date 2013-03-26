var sylvester = require('sylvester');
var utils     = require('./utils');

var Matrix = sylvester.Matrix;

/**
 * Multilayer Network
 * @param {Array} layers  Description of layers             (1)
 * @param {Array} weights Array of matrices used as weights (2)
 *
 * (1) [Integer]
 * (2) [Matrix]
 *
 */
var Network = function (layers, weights) {
  this.layers = layers;

  if (weights) this.setWeights(weights);

  // set default activation function
  this.setActivation(utils.sigmoid);
};

/**
 * Use setup to initialize network
 * @param  {Object}  setup Setup with layers and weights (1)
 * @return {Network}       Network instance
 *
 * (1) {
 *   layers: [Integer],
 *   weights: [Matrix]
 * }
 */
Network.fromJSON = function (setup) {
  var weights = utils.importWeights(setup.weights);

  return new Network(setup.layers, weights);
};

/**
 * Returns a setup which contains the configuration of the network
 * @return {Object} JSON
 */
Network.prototype.toJSON = function () {
  return {
    layers  : this.layers,
    weights : this.weights
  };
};

/**
 * Propagates the set up network and returns the output vector
 * @param  {Vector} inputs Input vector
 * @return {Vector}        Output vector
 */
Network.prototype.run = function (inputs) {
  var output = this.propagate(inputs);

  return output[output.length - 1].values;
};

/**
 * Propagates the set up network and returns a vector of outputs for each layer as an array
 * @param  {Vector} inputs Input vector
 * @return {Object}        Object with arrays of output vectors, raw and activated (1)
 *
 * (1) {
 *   raw: [Vector],
 *   values: [Vector]
 * }
 */
Network.prototype.propagate = function (inputs) {
  var output = [];

  var previousOutput, i, l, z, a;

  // add input vector to the outputs
  output.push({
    raw    : inputs,
    values : inputs
  });

  // iterate over layers and compute values
  for (i = 0, l = this.layers.length; i < l - 1; i++) {
    // add bias unit
    previousOutput = utils.addBiasUnit(output[i].values);

    // compute weighted sum
    z = this.weights[i].multiply(previousOutput);
    a = z.map(this.activation);

    output.push({
      raw    : z,
      values : a
    });
  }

  return output;
};

/**
 * Set weights
 * @param {Array} weights Array of matrices used as weights
 */
Network.prototype.setWeights = function (weights) {
  if (!this.validateWeights(weights)) throw new Error('Dimension mismatch of given weights');

  this.weights = weights;

  return this;
};

/**
 * Set activation function
 * @param {Function} activation Activation function
 */
Network.prototype.setActivation = function (activation) {
  this.activation = activation || this.activation;

  return this;
};

/**
 * Validate the given weights
 * @param  {Array}   weights Array of matrices (1)
 * @return {Boolean}         Valid
 *
 * (1) [Matrix]
 */
Network.prototype.validateWeights = function (weights) {
  var layer, previousLayer, layerWeights, i, l;

  for (i = 1, l = this.layers.length; i < l; i++) {
    layer         = this.layers[i];
    previousLayer = this.layers[i - 1];
    layerWeights  = weights[i - 1];

    if (!(
      layerWeights instanceof Matrix &&
      layerWeights.rows() === layer &&
      layerWeights.cols() === previousLayer + 1
    )) return false;
  }

  return true;
};

/**
 * Return a clone of the network
 * @return {Network} Deep clone
 */
Network.prototype.clone = function () {
  return new Network(this.layers, utils.cloneWeights(this.weights));
};

exports = module.exports = Network;
