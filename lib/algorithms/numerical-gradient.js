var Algorithm    = require('../algorithm');
var LogisticCost = require('./logistic-cost');
var utils        = require('../utils');

/**
 * Numerically estimates derivatives
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
 *   epsilon: Number (range used to approximate derivative)
 * }
 */
var NumericalGradient = function (network, examples, options) {
  Algorithm.call(this, network, examples, {
    epsilon: 0.0000001 // chosen for maximum accuracy
  });

  this.setCost(new LogisticCost());
  this.setOptions(options);
};

/**
 * Create instance
 * @param  {Object} network  Neural network
 * @param  {Array}  examples Training examples (1)
 * @param  {Object} options  Options           (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) {
 *   epsilon: Number (range used to approximate derivative)
 * }
 */
NumericalGradient.create = Algorithm.getFactory(NumericalGradient);

NumericalGradient.prototype = new Algorithm();

/**
 * Set cost function
 * @param {Function} cost Cost function
 */
NumericalGradient.prototype.setCost = function (cost) {
  this.cost = cost || this.cost;

  return this;
};

NumericalGradient.prototype.computeError = function (weights) {
  this.network.setWeights(weights);

  return this.cost
    .setNetwork(this.network)
    .setExamples(this.examples)
    .run();
};

/**
 * Numerically estimates derivatives
 * @return {Array} Derivatives (1)
 *
 * (1) [Matrix] (same dimensions as weights)
 */
NumericalGradient.prototype.run = function () {
  var thetaPlus, thetaMinus, i, j, k, l, m, n;

  var derivatives = utils.zeroWeights(this.network.layers);

  for (i = 0, l = derivatives.length; i < l; i++) {
    for (j = 0, m = derivatives[i].elements.length; j < m; j++) {
      for (k = 0, n = derivatives[i].elements[j].length; k < n; k++) {
        thetaPlus  = utils.cloneWeights(this.network.weights);
        thetaMinus = utils.cloneWeights(this.network.weights);

        thetaPlus[i].elements[j][k]  += this.options.epsilon;
        thetaMinus[i].elements[j][k] -= this.options.epsilon;

        derivatives[i].elements[j][k] = (this.computeError(thetaPlus) - this.computeError(thetaMinus)) / (this.options.epsilon * 2);
      }
    }
  }

  return derivatives;
};

exports = module.exports = NumericalGradient;
