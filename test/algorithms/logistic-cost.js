var assert = require('chai').assert;
var brain  = require('../../lib/brain');

var utils        = brain.utils;
var Network      = brain.Network;
var LogisticCost = brain.algorithms.LogisticCost;

describe('LogisticCost', function () {
  var network, logisticCost;

  var setup    = require('../setups/xnor');
  var examples = utils.importExamples(setup.examples);

  var options  = {
    lamda: 2
  };

  beforeEach(function () {
    network      = Network.fromJSON(setup);
    logisticCost = new LogisticCost(network, examples, options);
  });

  describe('constructor', function () {
    it('should set the given network', function () {
      assert.deepEqual(logisticCost.network, network, 'network matches');
    });

    it('should set the given examples', function () {
      assert.deepEqual(logisticCost.examples, examples, 'examples match');
    });

    it('should set the given options', function () {
      assert.deepEqual(logisticCost.options, options, 'options match');
    });
  });

  describe('create', function () {
    it('should return an instance of LogisticCost', function () {
      assert.instanceOf(LogisticCost.create(), LogisticCost, 'is instance of LogisticCost');
    });
  });

  describe('run', function () {
    it('should return a realistic error value', function () {
      var result = logisticCost.run();

      assert.isNumber(result, 'result is number');
      assert.operator(result, '>', 0, 'error is bigger than 0');
    });
  });
});
