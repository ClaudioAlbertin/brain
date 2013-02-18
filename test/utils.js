var assert    = require('chai').assert;
var sylvester = require('sylvester');
var utils     = require('../lib/utils');

var Matrix = sylvester.Matrix;

describe('Utils', function () {
  describe('randomWeights', function () {
    it('should return an array of matrices with correct dimensions', function () {
      var layers  = [3, 5, 2];
      var weights = utils.randomWeights(layers);
      var layer, previousLayer, layerWeights;

      assert.strictEqual(weights.length, layers.length - 1, 'dimensions match');

      for (var i = 1, l = layers.length; i < l; i++) {
        layer         = layers[i];
        previousLayer = layers[i - 1];
        layerWeights  = weights[i - 1];

        assert.instanceOf(layerWeights, Matrix, 'input is matrix');
        assert.strictEqual(layerWeights.rows(), layer, 'dimensions match');
        assert.strictEqual(layerWeights.cols(), previousLayer + 1, 'dimensions match');
      }
    });

    it('should return weights that are actually random', function () {
      var layers = [3, 5, 2];
      var firstWeights  = utils.randomWeights(layers);
      var secondWeights = utils.randomWeights(layers);

      assert.notStrictEqual(firstWeights, secondWeights, 'weights don\'t match');
    });
  });

  describe('sigmoid', function () {
    it('should compute correctly', function () {
      assert.closeTo(utils.sigmoid(0), 0.5, 0.0001, 'computed result is close to actual result');
      assert.closeTo(utils.sigmoid(10), 1, 0.0001, 'computed result is close to actual result');
      assert.closeTo(utils.sigmoid(-10), 0, 0.0001, 'computed result is close to actual result');
    });
  });
});
