var assert = require('chai').assert;
var Brain  = require('../lib/brain');

describe('Brain', function () {
  it('should export a function', function () {
    assert.isFunction(Brain, 'export is a function');
  });
});
