var utils     = require('../utils');
var Algorithm = require('../algorithm');
var sylvester = require('sylvester');

var Matrix = sylvester.Matrix;

/**
 * Computes derivatives
 * @param  {Object} network  Neural network
 * @param  {Array}  examples Training examples   (1)
 * @param  {Object} options  Options             (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) {
 *   delta: [Matrix] (Initial delta matrizes)
 * }
 */
var BackPropagation = function (network, examples, options) {
  Algorithm.call(this, network, examples, options);
};

/**
 * Create instance
 * @param  {Object} network  Neural network
 * @param  {Array}  examples Training examples   (1)
 * @param  {Object} options  Options             (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) {
 *   delta: [Matrix] (Initial delta matrizes)
 * }
 */
BackPropagation.create = Algorithm.getFactory(BackPropagation);

BackPropagation.prototype = new Algorithm();

/**
 * Computes derivatives
 * @return {Array} Derivatives (1)
 *
 * (1) [Matrix] (same dimensions as weights)
 */
BackPropagation.prototype.run = function () {
  var delta
    , example
    , input
    , output
    , expectedOutput
    , errors
    , biasedOutput
    , newDelta
    , i
    , l
    , j
    , m
    , error
    , weights;

  var derivatives = [];

  delta = (this.options.delta) ?
    utils.cloneWeights(this.options.delta) :
    utils.zeroWeights(this.network.layers);

  // removes the bias unit from the weights
  var trimWeights = function (x) {
    return x.slice(1);
  };

  // iterate over this.examples
  for (i = 0, l = this.examples.length; i < l; i++) {
    example        = this.examples[i];
    input          = example.input;
    expectedOutput = example.output;
    errors         = [];
    output         = this.network.propagate(input);

    // set errors for the output layer
    errors.push(output[output.length - 1].values.subtract(expectedOutput));

    // iterate backwards over layers
    for (j = output.length - 2; j > 0; j--) {
      weights = Matrix.create(this.network.weights[j].elements.map(trimWeights));

      // compute error
      error = weights
          .transpose()
          .multiply(errors[errors.length - 1])
          .elementMultiply(output[j].raw.map(utils.sigmoidDerivative));

      // set errors for layer j
      errors.push(error);
    }

    // reverse errors
    errors.reverse();

    for (j = 0, m = errors.length; j < m; j++) {
      biasedOutput = utils.toMatrix(utils.addBiasUnit(output[j].values));
      newDelta     = errors[j].transpose().multiply(biasedOutput);

      delta[j] = delta[j].add(newDelta);
    }
  }

  // compute derivative from deltas
  for (i = 0, l = delta.length; i < l; i++) {
    derivatives.push(delta[i].multiply(1 / this.examples.length));
  }

  return derivatives;
};

exports = module.exports = BackPropagation;
