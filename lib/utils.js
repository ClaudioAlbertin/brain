var sylvester = require('sylvester')
  , _         = require('lodash');

var Matrix = sylvester.Matrix
  , Vector = sylvester.Vector;

/**
 * Generates an array of random matrices with the given dimensions
 * @param  {Array}   layers Array with number of units per layer        (1)
 * @param  {Boolean} bias   Add weights for bias units, default is true
 * @return {Array}          Array of random matrices                    (2)
 *
 * (1) [Integer]
 * (2) [Matrix]
 */
exports.randomWeights = function (layers, bias) {
  var weights
    , i
    , l;

  weights = [];

  for (i = 1, l = layers.length; i < l; i++) {
    // generate weights for the given number of units and an additional bias unit
    weights.push(Matrix.Random(layers[i], layers[i - 1] + ((bias === false) ? 0 : 1)));
  }

  return weights;
};

/**
 * Generates an array of zero matrices with the given dimensions
 * @param  {Array}   layers Array with number of units per layer        (1)
 * @param  {Boolean} bias   Add weights for bias units, default is true
 * @return {Array}          Array of zero matrices                      (2)
 *
 * (1) [Integer]
 * (2) [Matrix]
 */
exports.zeroWeights = function (layers, bias) {
  var weights
    , i
    , l;

  weights = [];

  for (i = 1, l = layers.length; i < l; i++) {
    // generate weights for the given number of units and an additional bias unit
    weights.push(Matrix.Zero(layers[i], layers[i - 1] + ((bias === false) ? 0 : 1)));
  }

  return weights;
};

/**
 * Converts a multidimensional array to an array of matrices that can be used as weights
 * @param  {Array} weights Multidimensional input array (1)
 * @return {Array}         Array of matrices            (2)
 *
 * (1) [
 *   [
 *     [Integer]
 *   ]
 * ]
 *
 * (2) [Matrix]
 */
exports.importWeights = function (weights) {
  return weights.map(function (weights) {
    return Matrix.create(weights);
  });
};

/**
 * Converts an array of matrices to a multidimensional array that can be written to a JSON file
 * @param  {Array} weights Array of matrices             (1)
 * @return {Array}         Multidimensional export array (2)
 *
 * (1) [Matrix]
 * (2) [
 *   [
 *     [Integer]
 *   ]
 * ]
 */
exports.exportWeights = function (weights) {
  return weights.map(function (weights) {
    return weights.elements;
  });
};

/**
 * Returns the dimensions of the given weights
 * @param  {Array} weights Weights    (1)
 * @return {Array}         Dimensions (2)
 *
 * (1) [Matrix]
 * (2) [
 *   {
 *     cols: Integer,
 *     rows: Integer
 *   }
 * ]
 */
exports.getDimensions = function (weights) {
  return weights.map(function (weights) {
    return weights.dimensions();
  });
};

/**
 * Returns the layer map of the given weights
 * @param  {Array} weights Weights   (1)
 * @return {Array}         Layer map (2)
 *
 * (1) [Matrix]
 * (2) [Number]
 */
exports.getLayers = function (weights) {
  var layers
    , dimensions
    , layer
    , bias
    , i;

  layers = [];
  dimensions = exports.getDimensions(weights);

  // detect if bias unit is included
  bias = exports.detectBias(weights);

  // detect dimensions of input layer
  layers.push(dimensions[0].cols - ((bias === false) ? 0 : 1));

  // detect dimensions of remaining layers
  for (i = 0; layer = dimensions[i]; i++) {
    layers.push(layer.rows);
  }

  return layers;
};

/**
 * Detects if weights for bias units are included in the given set of weights
 * @param  {Array}   weights Weights
 * @return {Boolean}         Bias unit
 */
exports.detectBias = function (weights) {
  var dimensions = exports.getDimensions(weights);

  return dimensions[0].rows !== dimensions[1].cols;
};

/**
 * Converts a multidimensional array to an array of vectors that can be used as examples
 * @param  {Array} examples Multidimensional input array (1)
 * @return {Array}          Array of vectors             (2)
 *
 * (1) [
 *   {
 *     input: [Number],
 *     output: [Number]
 *   }
 * ]
 *
 * (2) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 */
exports.importExamples = function (examples) {
  return examples.map(function (example) {
    return {
      input  : Vector.create(example.input),
      output : Vector.create(example.output)
    };
  });
};

/**
 * Converts an array of matrices to a multidimensional array that can be written to a JSON file
 * @param  {Array} examples Array of matrices             (1)
 * @return {Array}          Multidimensional export array (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) [
 *   {
 *     input: [Number],
 *     output: [Number]
 *   }
 * ]
 */
exports.exportExamples = function (examples) {
  return examples.map(function (example) {
    return {
      input  : example.input.elements,
      output : example.output.elements
    };
  });
};

/**
 * Generates an object with information about the scale of the given data
 * @param  {Array}  values Array of numbers              (1)
 * @return {Object}        Object with scale information (2)
 *
 * (1) [Number]
 * (2) {
 *   min: Number,
 *   max: Number,
 *   abs: Number,
 *   avg: Number
 * }
 */
exports.findScale = function (values) {
  var min
    , max
    , sum
    , avg
    , abs
    , i
    , l;

  min = _.min(values);
  max = _.max(values);
  sum = 0;

  // calculate average
  for (i = 0, l = values.length; i < l; i++) {
    sum += values[i];
  }

  avg = sum / l;

  // calculate absolute value
  abs = (Math.abs(min) > Math.abs(max)) ? Math.abs(min) : Math.abs(max);

  return {
    min : min,
    max : max,
    abs : abs,
    avg : avg
  };
};

/**
 * Normalizes data
 * @param  {Number} value Value to normalize
 * @param  {Object} scale Scale              (1)
 * @return {Number}       Normalized value
 *
 * (1) {
 *   min: Number,
 *   max: Number
 * }
 */
exports.normalize = function (value, scale) {
  return 2 * (value - scale.min) / (scale.max - scale.min) - 1;
};

/**
 * Denormalizes data
 * @param  {Number} value Value to denormalize
 * @param  {Object} scale Scale                (1)
 * @return {Number}       Denormalized value
 *
 * (1) {
 *   min: Number,
 *   max: Number,
 *   abs: Number,
 *   avg: Number
 * }
 */
exports.denormalize = function (value, scale) {
  return (value + 1) * (scale.max - scale.min) / 2 + scale.min;
};

/**
 * Sigmoid function
 * @param  {Number} x Input
 * @return {Number}   Output
 */
exports.sigmoid = function (x) {
  return 1 / (1 + Math.exp(-x));
};

/**
 * Sigmoid derivative
 * @param  {Number} x Input
 * @return {Number}   Output
 */
exports.sigmoidDerivative = function (x) {
  var sigmoid = exports.sigmoid(x);

  return sigmoid * (1 - sigmoid);
};

/**
 * Square function
 * @param  {Number} x Input
 * @return {Number}   Squared output
 */
exports.square = function (x) {
  return Math.pow(x, 2);
};

/**
 * Adds bias unit to the beginning of a vector
 * @param  {Vector} output   Vector
 * @param  {Vector} modifier Modifier, returned value is set as the value of the bias unit
 * @return {Vector}          Vector with bias unit
 */
exports.addBiasUnit = function (vector, modifier) {
  var unit
    , biasedVector;

  unit = (modifier) ? modifier(1) : 1;

  biasedVector = vector.elements.slice(0);
  biasedVector.unshift(unit);

  return Vector.create(biasedVector);
};

/**
 * Converts a vector to a matrix
 * @param  {Vector} vector Vector
 * @return {Matrix}        Matrix
 */
exports.toMatrix = function (vector) {
  return Matrix.create([ vector.elements ]);
};

/**
 * Create a deep clone of the given weights
 * @param  {Array} weights Weights        (1)
 * @return {Array}         Cloned weights (2)
 *
 * (1) [Matrix]
 * (2) [Matrix]
 */
exports.cloneWeights = function (weights) {
  if (weights === undefined) return;

  return _.clone(weights).map(function (x) {
    return Matrix.create(_.clone(x.elements).map(_.clone));
  });
};

exports.deepAvg = function (array, element) {
  var sum
    , i
    , l;

  sum = 0;

  for (i = 0, l = array.length; i < l; i++) {
    sum += array[i][element];
  }

  return sum / i;
};
