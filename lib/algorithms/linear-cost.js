var utils     = require('../utils')
  , Algorithm = require('../algorithm');

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
 *   regularization: Number (Regularization multiplier, choose 0 for no regularization)
 * }
 */
var LinearCost = function (network, examples, options) {
  Algorithm.call(this, network, examples, {
    regularization: 0
  });

  this.setOptions(options);
};

LinearCost.prototype = new Algorithm();

LinearCost.prototype.clone = function () {
  return Algorithm.clone(LinearCost, this);
};

/**
 * Compute logitstic cost
 * @return {Number} Cost
 */
LinearCost.prototype.run = function () {
  var example
    , input
    , hypothesis
    , output
    , expectedOutput
    , cost
    , penalty
    , i
    , l
    , j
    , m;

  cost    = 0;
  penalty = 0;

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

    this.report('computation', {
      iterations : i + 1
    });
  }

  this.report('finished-computation', {
    iterations : i
  });

  cost = -1 * cost / this.examples.length;

  // square and sum up all weights
  for (i = 0, l = this.network.layers.length; i < l - 1; i++) {
    penalty += this.network.weights[i].map(utils.square).sum();
  }

  // multiply penalty with regularization
  penalty = (this.options.regularization / (2 * this.examples.length)) * penalty;

  return cost + penalty;
};

exports = module.exports = LinearCost;
