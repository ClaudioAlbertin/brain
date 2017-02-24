var _     = require('lodash')
  , utils = require('../utils');

/**
 * Training results
 * @param {Training} training Training
 * @param {Array}    weights  Array of matrices (1)
 *
 * (1) [Matrix]
 */
var TrainingResult = function (training, result) {
  this.training = training;
  _.extend(this, result);
};

/**
 * Returns a network with the newly computed weights
 * @return {Network} Network
 */
TrainingResult.prototype.getNetwork = function () {
  // clone network, set weights and cache result
  this.network = this.network || this.training.network.clone().setWeights(this.weights);

  return this.network;
};

/**
 * Returns the error
 * @return {Number} Error
 */
TrainingResult.prototype.getError = function () {
  // compute error and cache result
  this.error = this.error || this.training.cost
    .setNetwork(this.getNetwork())
    .setExamples(this.training.examples)
    .run();

  return this.error;
};

/**
 * Returns the newly computed weights
 * @return {Array} Weights (1)
 *
 * (1) [Matrix]
 */
TrainingResult.prototype.getWeights = function () {
  return this.weights;
};

TrainingResult.prototype.toJSON = function () {
  return {
    weights : utils.exportWeights(this.weights),
    error   : this.getError()
  };
};

exports = module.exports = TrainingResult;
