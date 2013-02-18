var assert = require('chai').assert;
var brain  = require('../lib/brain');

describe('brain', function () {
  it('should export an object', function () {
    assert.isObject(brain, 'export is an object');
    assert.property(brain, 'Perceptron', 'export contains the property perceptron');
  });
});
