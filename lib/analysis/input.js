var _              = require('lodash')
  , utils          = require('../utils')
  , AspectAnalysis = require('./aspect');

var InputAnalysis = function (analysis, options) {
  AspectAnalysis.call(this, analysis, {
    step     : 1,
    start    : 0,
    stop     : 10,
    provider : function () {
      throw new Error('Data provider must be set for InputAnalysis');
    }
  });

  this.setOptions(options);
};

InputAnalysis.prototype = new AspectAnalysis();

InputAnalysis.prototype.getValues = function () {
  return _.range(
    this.options.start,
    this.options.stop + this.options.step,
    this.options.step
  );
};

InputAnalysis.prototype.run = function () {
  var analyses
    , values
    , value
    , data
    , i
    , l;

  analyses = [];
  values   = this.getValues();

  for (i = 0, l = values.length; i < l; i++) {
    value = values[i];
    data  = this.options.provider(value);

    this.analysis.training.network.layers[0] = data.inputs;
    this.analysis.training.network.setWeights(utils.randomWeights(this.analysis.training.network.layers));
    this.analysis.training.setExamples(data.examples);

    analyses.push([value, this.analysis.run()]);

    this.report('analysis', {
      iterations : i + 1,
      value      : value
    });
  }

  return analyses;
};

exports = module.exports = InputAnalysis;
