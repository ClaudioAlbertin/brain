var Algorithm = require('../algorithm');

/**
 * Computes (mis)classification error, percentage of misclassified examples
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
var ClassificationError = function (network, examples, options) {
  Algorithm.call(this, network, examples, options);
};

ClassificationError.prototype = new Algorithm();

ClassificationError.prototype.clone = function () {
  return Algorithm.clone(ClassificationError, this);
};

/**
 * Compute (mis)classification error
 * @return {Number} Percentage of misclassified examples
 */
ClassificationError.prototype.run = function () {
  var example
    , hypothesis
    , errors
    , i
    , l;

  errors = 0;

  // iterate over examples and calculate cost
  for (i = 0, l = this.examples.length; i < l; i++) {
    example    = this.examples[i];
    hypothesis = this.network.run(example.input);

    if (!hypothesis.round().eql(example.output)) errors++;

    this.report('computation', {
      iterations : i + 1
    });
  }

  this.report('finished-computation', {
    iterations : i + 1
  });

  return errors / this.examples.length;
};

exports = module.exports = ClassificationError;
