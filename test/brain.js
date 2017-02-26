var assert = require('chai').assert;
var brain  = require('../lib/brain');

describe('brain', function () {
  it('should export an object with the correct structure', function () {
    assert.isObject(brain, 'export is an object');
    assert.property(brain, 'sylvester', 'export contains sylvester');
    assert.property(brain, 'utils', 'export contains utils');
    assert.property(brain, 'algorithms', 'export contains algorithms');
    assert.property(brain, 'Network', 'export contains Network');
    assert.property(brain, 'Training', 'export contains Training');
    assert.property(brain, 'Analysis', 'export contains Analysis');
    assert.property(brain, 'Vector', 'export contains Vector');
    assert.property(brain, 'Matrix', 'export contains Matrix');
  });
});
