var _     = require('underscore')
  , utils = require('../utils');

var AnalysisResult = function (analysis, result) {
  this.analysis = analysis;
  _.extend(this, result);
};

AnalysisResult.prototype.getTrainingError = function () {
  return this.trainingError;
};

AnalysisResult.prototype.getTestError = function () {
  return this.testError;
};

AnalysisResult.prototype.getErrors = function () {
  return this.errors;
};

AnalysisResult.prototype.getIterations = function () {
  return this.iterations;
};

AnalysisResult.prototype.getDevelopment = function () {
  return this.development;
};

AnalysisResult.prototype.getConvergence = function () {
  return this.convergence;
};

AnalysisResult.prototype.getTrainingTime = function () {
  return this.trainingTime;
};

AnalysisResult.prototype.getExecutionTime = function () {
  return this.executionTime;
};

AnalysisResult.prototype.getConvergenceAvg = function () {
  return utils.deepAvg(convergence, 1);
};

AnalysisResult.prototype.getFinalConvergence = function () {
  return this.convergence[this.convergence.length - 1][1];
};

AnalysisResult.prototype.toJSON = function () {
  return {
    trainingError    : this.getTrainingError(),
    testError        : this.getTestError(),
    errors           : this.getErrors(),
    iterations       : this.getIterations(),
    development      : this.getDevelopment(),
    convergence      : this.getConvergence(),
    trainingTime     : this.getTrainingTime(),
    executionTime    : this.getExecutionTime(),
    convergenceAvg   : this.getConvergenceAvg(),
    finalConvergence : this.getFinalConvergence()
  };
};

exports = module.exports = AnalysisResult;
