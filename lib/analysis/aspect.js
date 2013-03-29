var _ = require('underscore');

var ReportEmitter = require('../report-emitter');

var AspectAnalysis = function (analysis, options) {
  ReportEmitter.call(this);

  this.options = {};

  this.setAnalysis(analysis);
  this.setOptions(options);
};

AspectAnalysis.prototype = new ReportEmitter();

/**
 * Set options for the algorithm
 * @param {Object} options Options
 */
AspectAnalysis.prototype.setOptions = function (options) {
  this.options = _.extend(this.options, options);

  return this;
};

AspectAnalysis.prototype.setAnalysis = function (analysis) {
  if (analysis) this.analysis = analysis.clone();

  return this;
};

AspectAnalysis.prototype.run = function () {
  throw new Error('AspectAnalysis.run not implemented');
};

exports = module.exports = AspectAnalysis;
