var algorithms     = require('../algorithms');
var TrainingResult = require('./result');

/**
 * Training
 * @param {Network}   network      Network
 * @param {Algorithm} cost         Cost function
 * @param {Algorithm} derivative   Function to compute derivatives
 * @param {Algorithm} optimization Optimization function
 */
var Training = function (network, cost, derivative, optimization) {
  this.setNetwork(network);
  this.setCost(cost || new algorithms.LogisticCost());
  this.setDerivative(derivative || new algorithms.BackPropagation());
  this.setOptimization(optimization || new algorithms.GradientDescent());
};

/**
 * Set the used network
 * @param {Network} network Network
 */
Training.prototype.setNetwork = function (network) {
  this.network = network || this.network;

  return this;
};

/**
 * Set cost function
 * @param {Function} cost Cost function
 */
Training.prototype.setCost = function (cost) {
  this.cost = cost || this.cost;

  return this;
};

/**
 * Set optimization function
 * @param {Function} optimization Optimization function
 */
Training.prototype.setOptimization = function (optimization) {
  this.optimization = optimization || this.optimization;

  return this;
};

/**
 * Set function to compute derivatives
 * @param {Function} derivative Function to compute derivatives
 */
Training.prototype.setDerivative = function (derivative) {
  this.derivative = derivative || this.derivative;

  return this;
};

/**
 * Set examples
 * @param {Array} examples Array of examples (1)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 */
Training.prototype.setExamples = function (examples) {
  this.examples = examples || this.examples;

  return this;
};

/**
 * Trains the network and returns the newly computed weights and the associated error
 * @param  {Array}          examples Array of examples
 * @return {TrainingResult}          Training result
 */
Training.prototype.run = function (examples) {
  this.setExamples(examples);

  // compute optimized weights
  var weights = this.optimization
    .setNetwork(this.network)
    .setExamples(this.examples)
    .setCost(this.cost)
    .setDerivative(this.derivative)
    .run();

  return new TrainingResult(this, weights);
};

exports = module.exports = Training;
