var sylvester = require('sylvester');

var Matrix = sylvester.Matrix;

/**
 * Generates an array of random matrices with the given dimensions
 * @param  {Array}   layers Array with number of units per layer
 * @param  {Boolean} bias   Add weights for bias units, default is true
 * @return {Array}          Array of random matrices
 */
exports.randomWeights = function (layers, bias) {
  var weights = [];
  var layer, previousLayer;

  for (var i = 1, l = layers.length; i < l; i++) {
    layer         = layers[i];
    previousLayer = layers[i - 1];

    // generate weights for the given number of units and an additional bias unit
    weights.push(Matrix.Random(layer, previousLayer + !!bias));
  }

  return weights;
};

/**
 * Sigmoid function
 * @param  {Number} t input
 * @return {Number}   output
 */
exports.sigmoid = function (t) {
  return 1 / (1 + Math.pow(Math.E, -t));
};
