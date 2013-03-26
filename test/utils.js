var fs     = require('fs');
var path   = require('path');
var assert = require('chai').assert;
var brain  = require('../lib/brain');

var sylvester = brain.sylvester;
var utils     = brain.utils;

var Matrix = sylvester.Matrix;
var Vector = sylvester.Vector;

describe('Utils', function () {
  var exportedWeights = [
    [
      [1, 2, 3],
      [2, 3, 4]
    ],
    [
      [3, 4, 5]
    ]
  ];

  var importedWeights = [
    Matrix.create([
      [1, 2, 3],
      [2, 3, 4]
    ]),
    Matrix.create([
      [3, 4, 5]
    ])
  ];

  var exportedExamples = [
    { input: [1, 2, 3], output: [2, 3, 4] },
    { input: [3, 4, 5], output: [4, 5, 6] },
    { input: [5, 6, 7], output: [6, 7, 8] }
  ];

  var importedExamples = [
    { input: Vector.create([1, 2, 3]), output: Vector.create([2, 3, 4]) },
    { input: Vector.create([3, 4, 5]), output: Vector.create([4, 5, 6]) },
    { input: Vector.create([5, 6, 7]), output: Vector.create([6, 7, 8]) }
  ];

  var data = [
    2000,
    1000,
    60,
    -20,
    -40,
    -3000
  ];

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

      assert.notDeepEqual(firstWeights, secondWeights, 'weights don\'t match');
    });
  });

  describe('importWeights', function () {
    it('should return a matching array of matrices', function () {
      assert.deepEqual(utils.importWeights(exportedWeights), importedWeights, 'weights match');
    });
  });

  describe('exportWeights', function () {
    it('should return a matching multidimensional array', function () {
      assert.deepEqual(utils.exportWeights(importedWeights), exportedWeights, 'weights match');
    });
  });

  describe('importExamples', function () {
    it('should return a matching array examples', function () {
      assert.deepEqual(utils.importExamples(exportedExamples), importedExamples, 'examples match');
    });
  });

  describe('exportExamples', function () {
    it('should return a matching array of examples', function () {
      assert.deepEqual(utils.exportExamples(importedExamples), exportedExamples, 'examples match');
    });
  });

  describe('findScale', function () {
    var scale;

    beforeEach(function () {
      scale = utils.findScale(data);
    });

    it('should return an object with correct structure', function () {
      assert.isObject(scale, 'return value is object');
      assert.property(scale, 'min', 'object contains minimum');
      assert.property(scale, 'max', 'object contains maximum');
      assert.property(scale, 'abs', 'object contains absolute');
      assert.property(scale, 'avg', 'object contains average');
    });

    it('should compute minimum correctly', function () {
      assert.strictEqual(scale.min, -3000, 'minimum is correct');
    });

    it('should compute maximum correctly', function () {
      assert.strictEqual(scale.max, 2000, 'maximum is correct');
    });

    it('should compute absolute correctly', function () {
      assert.strictEqual(scale.abs, 3000, 'absolute is correct');
    });

    it('should compute average correctly', function () {
      assert.strictEqual(scale.avg, 0, 'average is correct');
    });
  });

  describe('normalize', function () {
    var scale;

    beforeEach(function () {
      scale = utils.findScale(data);
    });

    it('should return values between -1 and 1 (given the average of the data is 0)', function () {
      var i, number, result;

      for (i = 0; number = data[i]; i++) {
        result = utils.normalize(number, scale);

        assert.operator(result, '<=', 1, 'result is smaller or equal to 1');
        assert.operator(result, '>=', -1, 'result is larger or equal to -1');
      }
    });
  });

  describe('denormalize', function () {
    var scale;

    beforeEach(function () {
      scale = utils.findScale(data);
    });

    it('should bring values back to normal scale', function () {
      var i, x, result;

      for (i = 0; x = data[i]; i++) {
        result = utils.normalize(x, scale);

        assert.equal(utils.denormalize(result, scale), x, 'numbers match');
      }
    });

    it('rescaled data should have the same scale as before', function () {
      var result = data.map(function (x) {
        return utils.denormalize(utils.normalize(x, scale), scale);
      });

      assert.deepEqual(utils.findScale(result), scale, 'scales match');
    });
  });

  describe('sigmoid', function () {
    it('should compute correctly', function () {
      assert.closeTo(utils.sigmoid(0), 0.5, 0.0001, 'computed result is close to expected result');
      assert.closeTo(utils.sigmoid(10), 1, 0.0001, 'computed result is close to expected result');
      assert.closeTo(utils.sigmoid(-10), 0, 0.0001, 'computed result is close to expected result');
    });
  });

  describe('sigmoidDerivative', function () {
    it('should compute correctly', function () {
      assert.closeTo(utils.sigmoidDerivative(0), 0.25, 0.0001, 'computed result is close to expected result');
      assert.closeTo(utils.sigmoidDerivative(10), 0, 0.0001, 'computed result is close to exptected result');
      assert.closeTo(utils.sigmoidDerivative(-10), 0, 0.0001, 'computed result is close to exptected result');
    });
  });

  describe('square', function () {
    it('should compute correctly', function () {
      assert.equal(utils.square(1), 1, 'computed result is equal to expected result');
      assert.equal(utils.square(2), 4, 'computed result is equal to expected result');
      assert.closeTo(utils.square(3.14), 9.8596, 0.000001, 'computed result is close to expected result');
    });
  });

  describe('addBiasUnit', function () {
    var vector, biasedVector, modifiedVector;

    beforeEach(function () {
      vector         = Vector.create([5, 6, 7]);
      biasedVector   = Vector.create([1, 5, 6, 7]);
      modifiedVector = Vector.create([2, 5, 6, 7]);
    });

    it('should add a bias unit', function () {
      assert.deepEqual(utils.addBiasUnit(vector), biasedVector, 'vectors match');
    });

    it('should use a given modifier', function () {
      assert.deepEqual(utils.addBiasUnit(vector, function (x) {
        return 2 * x;
      }), modifiedVector);
    });
  });

  describe('toMatrix', function () {
    var vector, matrix;

    beforeEach(function () {
      vector = Vector.create([1, 2, 3]);
      matrix = Matrix.create([ [1, 2, 3] ]);
    });

    it('should return a Matrix with correct dimensions', function () {
      assert.instanceOf(utils.toMatrix(vector), Matrix, 'returned object is matrix');
      assert.deepEqual(utils.toMatrix(vector), matrix, 'matrices match');
    });
  });

  describe('writeJSON', function () {
    var tempDir    = require('../package').directories.temp;
    var tempModule = path.join(tempDir, 'utils-writeJSON-test');
    var tempFile   = tempModule + '.json';

    var setup = require('./setups/xnor');

    tempModule = path.join('../', tempModule);

    beforeEach(function (done) {
      fs.mkdir(tempDir, function () {
        done();
      });
    });

    afterEach(function (done) {
      fs.unlink(tempFile, function () {
        fs.rmdir(tempDir, function () {
          done();
        });
      });
    });

    it('should create a file at the correct path', function (done) {
      utils.writeJSON(tempFile, setup, function (err) {
        if (err) throw err;

        fs.exists(tempFile, function (exists) {
          assert.isTrue(exists);
          done();
        });
      });
    });

    it('should write a file that can be loaded and matches', function (done) {
      utils.writeJSON(tempFile, setup, function (err) {
        if (err) throw err;

        assert.deepEqual(require(tempModule), setup, 'JSON matches');
        done();
      });
    });
  });

  describe('cloneWeights', function () {
    it('should return a clone', function () {
      var clone = utils.cloneWeights(importedWeights);

      assert.notStrictEqual(clone, importedWeights, 'instances do not match');
    });
  });
});
