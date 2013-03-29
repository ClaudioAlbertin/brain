var _              = require('underscore')
  , Examples       = require('../examples')
  , AspectAnalysis = require('./aspect');

var ExampleAnalysis = function (analysis, options) {
  AspectAnalysis.call(this, analysis, {
    step  : 100,
    start : 100,
    stop  : 0
  });

  this.setOptions(options);
};

ExampleAnalysis.prototype = new AspectAnalysis();

ExampleAnalysis.prototype.getValues = function () {
  return _.range(
    this.options.start,
    (this.options.stop || this.analysis.training.examples.length) + this.options.step,
    this.options.step
  );
};

ExampleAnalysis.prototype.run = function () {
  var analyses
    , values
    , value
    , examples
    , i
    , l;

  analyses = [];
  values   = this.getValues();

  for (i = 0, l = values.length; i < l; i++) {
    value = values[i];

    examples = new Examples(this.analysis.training.examples).getSet(value, value);

    this.analysis.training.setExamples(examples);

    analyses.push([value, this.analysis.run()]);

    this.report('analysis', {
      iterations : i + 1,
      value      : value
    });
  }

  return analyses;
};

exports = module.exports = ExampleAnalysis;
