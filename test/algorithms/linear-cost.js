var assert = require('chai').assert;
var brain  = require('../../lib/brain');

var utils      = brain.utils;
var Network    = brain.Network;
var LinearCost = brain.algorithms.LinearCost;

describe('LinearCost', function () {
  var network, linearCost;

  var setup    = require('../setups/xnor');
  var examples = utils.importExamples(setup.examples);

  var options  = {
    lamda: 2
  };

  beforeEach(function () {
    network    = Network.fromJSON(setup);
    linearCost = new LinearCost(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(linearCost.network, network, 'network matches');
    });

    it('should set the given examples', function () {
      assert.deepEqual(linearCost.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(linearCost.options, options, 'options match');
    });
  });

  describe('create', function () {
    it('should return an instance of LinearCost', function () {
      assert.instanceOf(LinearCost.create(), LinearCost, 'is instance of LinearCost');
    });
  });

  describe('run', function () {
    it('should return a realistic error value', function () {
      var result = linearCost.run();

      assert.isNumber(result, 'result is number');
      assert.operator(result, '>', 0, 'error is bigger than 0');
    });
  });
});
