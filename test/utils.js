var assert = require('chai').assert
  , brain  = require('../lib/brain');

var sylvester = brain.sylvester
  , utils     = brain.utils;

var Network = brain.Network
  , Matrix  = sylvester.Matrix
  , Vector  = sylvester.Vector;

describe('Utils', function () {
  var exportedWeights
    , importedWeights
    , exportedExamples
    , importedExamples
    , data;

  before(function () {
    // used in tests for importWeights and exportWeights
    exportedWeights = [
      [
        [1, 2, 3],
        [2, 3, 4]
      ],
      [
        [3, 4, 5]
      ]
    ];

    importedWeights = [
      Matrix.create([
        [1, 2, 3],
        [2, 3, 4]
      ]),
      Matrix.create([
        [3, 4, 5]
      ])
    ];

    // used in tests for importExamples and exportExamples
    exportedExamples = [
      { input: [1, 2, 3], output: [2, 3, 4] },
      { input: [3, 4, 5], output: [4, 5, 6] },
      { input: [5, 6, 7], output: [6, 7, 8] }
    ];

    importedExamples = [
      { input: Vector.create([1, 2, 3]), output: Vector.create([2, 3, 4]) },
      { input: Vector.create([3, 4, 5]), output: Vector.create([4, 5, 6]) },
      { input: Vector.create([5, 6, 7]), output: Vector.create([6, 7, 8]) }
    ];

    // used in tests for normalize, denormalize and findScale
    data = [
      2000,
      1000,
      60,
      -20,
      -40,
      -3000
    ];
  });

  describe('randomWeights', function () {
    var layers;

    before(function () {
      layers = [2, 3, 1];
    });

    it('should return valid weights with correct dimensions', function () {
      var network
        , weights;

      network = new Network(layers);
      weights = utils.randomWeights(layers);

      assert.isTrue(network.validateWeights(weights), 'weights valid');
      assert.deepEqual(utils.getLayers(weights), layers, 'layers match');
    });

    it('should return weights that are actually random', function () {
      var firstWeights  = utils.randomWeights(layers)
        , secondWeights = utils.randomWeights(layers);

      assert.notDeepEqual(firstWeights, secondWeights, 'weights do not match');
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

  describe('getDimensions', function () {
    var dimensions
      , weights;

    before(function () {
      dimensions = [
        { rows: 3, cols: 3 },
        { rows: 2, cols: 4}
      ];

      weights = [
        Matrix.create([
          [1, 2, 3],
          [2, 3, 4],
          [3, 4, 5]
        ]),
        Matrix.create([
          [1, 2, 3, 4],
          [2, 3, 4, 5]
        ])
      ];
    });

    it('should detect the correct dimensions', function () {
      assert.deepEqual(utils.getDimensions(weights), dimensions);
    });
  });

  describe('getLayers', function () {
    var layers
      , weights;

    before(function () {
      layers  = [2, 3, 1];
      weights = utils.randomWeights(layers);
    });

    it('should detect the correct layer map', function () {
      assert.deepEqual(utils.getLayers(weights), layers);
    });
  });

  describe('detectBias', function () {
    var layers
      , biasedWeights
      , unbiasedWeights;

    before(function () {
      layers          = [2, 3, 1];
      biasedWeights   = utils.randomWeights(layers);
      unbiasedWeights = utils.randomWeights(layers, false);
    });

    it('should detect bias unit if included', function () {
      assert.isTrue(utils.detectBias(biasedWeights), 'bias unit detected');
    });

    it('should detect no bias unit if not included', function () {
      assert.isFalse(utils.detectBias(unbiasedWeights), 'bias unit not detected');
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

    before(function () {
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

    before(function () {
      scale = utils.findScale(data);
    });

    it('should return values between -1 and ', function () {
      var result
        , x
        , i;

      for (i = 0; x = data[i]; i++) {
        result = utils.normalize(x, scale);

        assert.operator(result, '<=', 1, 'result is smaller or equal to 1');
        assert.operator(result, '>=', -1, 'result is larger or equal to -1');
      }
    });
  });

  describe('denormalize', function () {
    var scale;

    before(function () {
      scale = utils.findScale(data);
    });

    it('should bring values back to normal scale', function () {
      var result
        , x
        , i;

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
    var vector
      , biasedVector
      , modifiedVector;

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
        return x * 2;
      }), modifiedVector);
    });
  });

  describe('toMatrix', function () {
    var vector
      , matrix;

    before(function () {
      vector = Vector.create([1, 2, 3]);
      matrix = Matrix.create([ [1, 2, 3] ]);
    });

    it('should return a Matrix with correct dimensions', function () {
      assert.instanceOf(utils.toMatrix(vector), Matrix, 'returned object is matrix');
      assert.deepEqual(utils.toMatrix(vector), matrix, 'matrices match');
    });
  });

  describe('cloneWeights', function () {
    it('should return a clone', function () {
      var clone = utils.cloneWeights(importedWeights);

      assert.notStrictEqual(clone, importedWeights, 'instances do not match');
    });
  });
});
