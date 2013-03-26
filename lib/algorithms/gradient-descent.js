var Algorithm       = require('../algorithm');
var LogisticCost    = require('./logistic-cost');
var BackPropagation = require('./back-propagation');

/**
 * Optimizes weights
 * @param {Network} network  Neural network
 * @param {Array}   examples Array of examples (1)
 * @param {Object}  options  Options           (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) {
 *   learningRate: Number,
 *   targetError: Number (Targeted error, algorithm will stop when error achieved),
 *   iterations: Integer (Iteration limit),
 *   reportFrequency: Integer (Frequency of reporting and error checking)
 * }
 */
var GradientDescent = function (network, examples, options) {
  Algorithm.call(this, network, examples, {
    learningRate    : 1,
    iterations      : 10000,
    targetError     : 0.2,
    reportFrequency : 1000,
    minimalSpeed    : 0
  });

  this.setOptions(options);

  this.setCost(new LogisticCost());
  this.setDerivative(new BackPropagation());
};

GradientDescent.ERROR_INCREASING = 1;
GradientDescent.ERROR_DECREASING = -1;

/**
 * Create instance
 * @param {Network} network  Neural network
 * @param {Array}   examples Array of examples (1)
 * @param {Object}  options  Options           (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) {
 *   learningRate: Number,
 *   targetError: Number (Targeted error, algorithm will stop when error achieved),
 *   iterations: Integer (Iteration limit)
 * }
 */
GradientDescent.create = Algorithm.getFactory(GradientDescent);

GradientDescent.prototype = new Algorithm();

/**
 * Set cost function
 * @param {Function} cost Cost function
 */
GradientDescent.prototype.setCost = function (cost) {
  this.cost = cost || this.cost;

  return this;
};

/**
 * Set function to compute derivatives
 * @param {Function} derivative Function to compute derivatives
 */
GradientDescent.prototype.setDerivative = function (derivative) {
  this.derivative = derivative || this.derivative;

  return this;
};

/**
 * Scales derivative according to the learning rate
 * @param  {Matrix} derivative Derivative
 * @return {Matrix}            Scaled derivative
 */
GradientDescent.prototype.scaleDerivative = function (derivative) {
  return derivative.multiply(this.options.learningRate);
};

/**
 * Computes error with the given cost function
 * @param  {Array}  weights Weights (1)
 * @return {Number}         Cost
 *
 * (1) [Matrix]
 */
GradientDescent.prototype.computeError = function (weights) {
  this.network.setWeights(weights);

  return this.cost
    .setNetwork(this.network)
    .setExamples(this.examples)
    .run();
};

/**
 * Optimizes weights
 * @return {Array} Weights (1)
 *
 * (1) [Matrix]
 */
GradientDescent.prototype.run = function () {
  var weights   = this.network.weights;
  var lastError = Infinity;

  var derivatives, error, speed, i, l, j, m;

  // stop after the given number of iterations
  for (i = 0, l = this.options.iterations; i < this.options.iterations; i++) {
    // compute derivatives
    derivatives = this.derivative
      .setNetwork(this.network)
      .setExamples(this.examples)
      .run();

    // update weights
    for (j = 0, m = derivatives.length; j < m; j++) {
      weights[j] = weights[j].subtract(this.scaleDerivative(derivatives[j]));
    }

    // report with the given frequency
    if (i % this.options.reportFrequency === 0) {
      error = this.computeError(weights);

      speed = lastError - error;

      this.report('optimization', {
        iterations  : i,
        error       : error,
        speed       : speed,
        development : (error <= lastError) ?
          GradientDescent.ERROR_DECREASING :
          GradientDescent.ERROR_INCREASING
      });

      if (error <= this.options.targetError || speed < this.options.minimalSpeed) break;

      lastError = error;
    }
  }

  error = this.computeError(weights);

  this.report('finished-optimization', {
    iterations  : i,
    error       : error,
    speed       : lastError - error,
    development : (error <= lastError) ?
      GradientDescent.ERROR_DECREASING :
      GradientDescent.ERROR_INCREASING
  });

  return weights;
};

exports = module.exports = GradientDescent;
