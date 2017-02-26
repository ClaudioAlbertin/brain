const sylvester = require('sylvester');

exports = module.exports = {
  sylvester     : sylvester,
  utils         : require('./utils'),
  factory       : require('./factory'),
  algorithms    : require('./algorithms'),
  Algorithm     : require('./algorithm'),
  Network       : require('./network'),
  Training      : require('./training'),
  Analysis      : require('./analysis'),
  Examples      : require('./examples'),
  ReportEmitter : require('./report-emitter'),
  Vector        : sylvester.Vector,
  Matrix        : sylvester.Matrix
};
