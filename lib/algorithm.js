var _     = require('underscore');

/**
 * Algorithm
 */
var Algorithm = function (network, examples, options) {
  this.examples  = [];
  this.options   = {};
  this.reporters = {
    all: []
  };

  this.setNetwork(network);
  this.setExamples(examples);
  this.setOptions(options);
};

/**
 * Returns a function that creates an instance of the algorithm
 * @param  {Algorithm} Algorithm Constructor
 * @return {Function}            Create function
 */
Algorithm.getFactory = function (Algorithm) {
  return function (network, examples, options) {
    return new Algorithm(network, examples, options);
  };
};

/**
 * Adds a reporter
 * @param {Function} reporter Reporter
 */
Algorithm.prototype.addReporter = function (event, reporter) {
  if (typeof event === 'function') {
    reporter = event;
    event    = 'all';
  }

  if (!reporter) return this;
  if (this.reporters[event] === undefined) this.reporters[event] = [];

  this.reporters[event].push(reporter);

  return this;
};

/**
 * Set the network instance
 * @param {Network} network Network
 */
Algorithm.prototype.setNetwork = function (network) {
  if (network) this.network = network.clone();

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
 * Report information
 * @param {String} name Report name
 * @param {Object} data Information to report
 */
Algorithm.prototype.report = function (event, data) {
  var i, reporter;
  var reporters = _.union(this.reporters.all, this.reporters[event]);

  for (i = 0; reporter = reporters[i]; i++) {
    reporter(event, data);
  }

  return this;
};

/**
 * Executes the algorithm, must be implemented by child class
 * @throws Error
 */
Algorithm.prototype.run = function () {
  throw new Error('Algorithm.run not implemented');
};

exports = module.exports = Algorithm;
