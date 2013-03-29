var _ = require('underscore');

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

AnalysisResult.prototype.toJSON = function () {
  return {
    trainingError : this.getTrainingError(),
    testError     : this.getTestError(),
    errors        : this.getErrors(),
    iterations    : this.getIterations(),
    development   : this.getDevelopment(),
    convergence   : this.getConvergence(),
    trainingTime  : this.getTrainingTime(),
    executionTime : this.getExecutionTime()
  };
};

exports = module.exports = AnalysisResult;
