var Analysis = require('./analysis');

exports.createFullAnalysis = function (analysis, options) {
  var runner = new Analysis.Runner(analysis);

  options = options || {};

  runner
    .addAspect('regularization', new Analysis.Regularization(null, options.regularization))
    .addAspect('learningRate', new Analysis.LearningRate(null, options.learningRate))
    .addAspect('layer', new Analysis.Layer(null, options.layer))
    .addAspect('input', new Analysis.Input(null, options.input))
    .addAspect('example', new Analysis.Example(null, options.example));

  return runner;
};

exports.createBasicAnalysis = function (analysis, options) {
  var runner = new Analysis.Runner(analysis);

  options = options || {};

  runner
    .addAspect('regularization', new Analysis.Regularization(null, options.regularization))
    .addAspect('learningRate', new Analysis.LearningRate(null, options.learningRate))
    .addAspect('layer', new Analysis.Layer(null, options.layer));

  return runner;
};
