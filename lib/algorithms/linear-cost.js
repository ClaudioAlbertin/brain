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
 * (2) {}
 */
var LinearCost = function (network, examples, options) {
  Algorithm.call(this, network, examples, options);
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
    , i
    , l
    , j
    , m;

  cost = 0;

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

    if (i % this.options.reportFrequency === 0) {
      this.report('computation', {
        iterations: i + 1
      });
    }
  }

  this.report('finished-computation', {
    iterations : i + 1
  });

  return -1 * cost / this.examples.length;
};

exports = module.exports = LinearCost;
