var _              = require('underscore')
  , algorithms     = require('../algorithms')
  , Network        = require('../network')
  , TrainingResult = require('./result');

/**
 * Training
 * @param {Network}   network      Network
 * @param {Algorithm} cost         Cost function
 * @param {Algorithm} derivative   Function to compute derivatives
 * @param {Algorithm} optimization Optimization function
 */
var Training = function (network, cost, derivative, optimization, options) {
  this.options = {};

  this.setOptions({
    cost         : {},
    optimization : {},
    derivative   : {}
  });

  this.setOptions(options);

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
 * Set options
 */
Training.prototype.setOptions = function (options) {
  this.options = _.extend(this.options, options);

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
 * Return a clone of the training
 * @return {Training} Deep clone
 */
Training.prototype.clone = function () {
  var clone = new Training(
    Network.prototype.clone.call(this.network),
    this.cost.clone(),
    this.derivative.clone(),
    this.optimization.clone()
  );

  clone.setExamples(this.examples);

  return clone;
};

/**
 * Trains the network and returns the newly computed weights and the associated error
 * @param  {Array}          examples Array of examples
 * @return {TrainingResult}          Training result
 */
Training.prototype.run = function (examples) {
  this.setExamples(examples);

  this.cost.setOptions(this.options.cost);
  this.optimization.setOptions(this.options.optimization);
  this.derivative.setOptions(this.options.derivative);

  // compute optimized weights
  var weights = this.optimization
    .setNetwork(this.network)
    .setExamples(this.examples)
    .setCost(this.cost)
    .setDerivative(this.derivative)
    .run();

  return new TrainingResult(this, { weights: weights });
};

exports = module.exports = Training;
