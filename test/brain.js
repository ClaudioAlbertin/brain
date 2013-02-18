var assert = require('chai').assert;
var brain  = require('../lib/brain');

describe('brain', function () {
  it('should export an object with the correct structure', function () {
    assert.isObject(brain, 'export is an object');
    assert.property(brain, 'networks', 'export contains the networks property');
  });
});
