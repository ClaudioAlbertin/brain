var _              = require('lodash')
  , AspectAnalysis = require('./aspect');

var LearningRateAnalysis = function (analysis, options) {
  AspectAnalysis.call(this, analysis, {
    step  : 0.1,
    start : 0.1,
    stop  : 5
  });

  this.setOptions(options);
};

LearningRateAnalysis.prototype = new AspectAnalysis();

LearningRateAnalysis.prototype.getValues = function () {
  return _.range(
    this.options.start,
    this.options.stop + this.options.step,
    this.options.step
  );
};

LearningRateAnalysis.prototype.run = function () {
  var analyses
    , values
    , value
    , i
    , l;

  analyses = [];
  values   = this.getValues();

  for (i = 0, l = values.length; i < l; i++) {
    value = values[i];

    this.analysis.training.optimization.setOptions({ learningRate: value });

    analyses.push([value, this.analysis.run()]);

    this.report('analysis', {
      iterations : i + 1,
      value      : value
    });
  }

  return analyses;
};

exports = module.exports = LearningRateAnalysis;
