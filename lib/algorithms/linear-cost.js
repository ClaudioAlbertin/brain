var utils     = require('../utils');
var Algorithm = require('../algorithm');

/**
 * Computes Linear cost
 * @param  {Object} network  Neural network
 * @param  {Array}  examples Array of examples (1)
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
 *   lamda: Number (Regularization multiplier, choose 0 for no regularization)
 * }
 */
var LinearCost = function (network, examples, options) {
  Algorithm.call(this, network, examples, {
    lamda: 0
  });

  this.setOptions(options);
};

/**
 * Create instance
 * @param  {Object} network  Neural network
 * @param  {Array}  examples Array of examples (1)
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
 *   lamda: Number (Regularization multiplier, choose 0 for no regularization)
 * }
 */
LinearCost.create = Algorithm.getFactory(LinearCost);

LinearCost.prototype = new Algorithm();

/**
 * Compute logitstic cost
 * @return {Number} Cost
 */
LinearCost.prototype.run = function () {
  var cost    = 0;
  var penalty = 0;

  var example, input, hypothesis, output, expectedOutput, i, l, j, m;

  // iterate over examples and calculate cost
  for (i = 0, l = this.examples.length; i < l; i++) {
    example    = this.examples[i];
    input      = example.input;
    hypothesis = this.network.run(input);

    for (j = 1, m = example.output.dimensions().cols; j <= m; j++) {
      expectedOutput = example.output.e(j);
      output         = hypothesis.e(j);

      cost += utils.square(output - expectedOutput);
    }
  }

  cost = -1 * cost / this.examples.length;

  // square and sum up all weights
  for (i = 0, l = this.network.layers.length; i < l - 1; i++) {
    penalty += this.network.weights[i].map(utils.square).sum();
  }

  // multiply penalty with lamda
  penalty = (this.options.lamda / (2 * this.examples.length)) * penalty;

  return cost + penalty;
};

exports = module.exports = LinearCost;
