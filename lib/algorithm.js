var _             = require('underscore')
  , Network       = require('./network')
  , ReportEmitter = require('./report-emitter');

/**
 * Algorithm
 */
var Algorithm = function (network, examples, options) {
  ReportEmitter.call(this);

  this.examples  = [];
  this.options   = {};

  this.setNetwork(network);
  this.setExamples(examples);
  this.setOptions(options);
};

Algorithm.prototype = new ReportEmitter();

/**
 * Set the network instance
 * @param {Network} network Network
 */
Algorithm.prototype.setNetwork = function (network) {
  this.network = Network.prototype.clone.call(network) || this.network;

  return this;
};

/**
 * Set examples
 * @param {Array} examples Examples (1)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 */
Algorithm.prototype.setExamples = function (examples) {
  this.examples = examples || this.examples;

  return this;
};

/**
 * Set options for the algorithm
 * @param {Object} options Options
 */
Algorithm.prototype.setOptions = function (options) {
  this.options = _.extend(this.options, options);

  return this;
};

/**
 * Return a clone of the network
 * @return {Network} Deep clone
 */
Algorithm.clone = function (Algorithm, algorithm) {
  var clone = new Algorithm(
    Network.prototype.clone.call(algorithm.network),
    _.clone(algorithm.examples),
    _.clone(algorithm.options)
  );

  clone.addReporters(algorithm.reporters);

  return clone;
};

/**
 * Executes the algorithm, must be implemented by child class
 * @throws Error
 */
Algorithm.prototype.run = function () {
  throw new Error('Algorithm.run not implemented');
};

exports = module.exports = Algorithm;
