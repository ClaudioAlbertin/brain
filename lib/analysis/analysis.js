var _ = require('underscore');

var Examples       = require('../examples')
  , ReportEmitter  = require('../report-emitter')
  , AnalysisResult = require('./result');

var Analysis = function (training, options) {
  ReportEmitter.call(this);

  this.options = {};

  this.setOptions({
    testSetSize : 0.3,
    testSet     : []
  });

  this.setOptions(options);
  this.setTraining(training);
};

Analysis.prototype = new ReportEmitter();

/**
 * Set options for the algorithm
 * @param {Object} options Options
 */
Analysis.prototype.setOptions = function (options) {
  this.options = _.extend(this.options, options);

  return this;
};

Analysis.prototype.setTraining = function (training) {
  this.training = training || this.training;

  return this;
};


Analysis.prototype.clone = function () {
  var clone = new Analysis(
    (this.training) ? this.training.clone() : null,
    _.clone(this.options)
  );

  clone.addReporters(this.reporters);

  return clone;
};

Analysis.prototype.run = function () {
  var analysisResult
    , trainingResult
    , convergence
    , errors
    , examples
    , testSet
    , trainingSet
    , trainingError
    , testError
    , development
    , iterations
    , trainingTime
    , executionTime
    , training;

  training = this.training.clone();

  // get test set if none was given
  if (!this.options.testSet && this.options.testSetSize) {
    examples = new Examples(training.examples);

    testSet     = examples.getSet('test', this.options.testSetSize);
    trainingSet = examples.getSet('training', Infinity);
  } else {
    testSet     = this.options.testSet;
    trainingSet = training.examples;
  }

  convergence = {};
  errors      = {};

  training.optimization.addReporter('optimization', function (event, data) {
    errors[data.iterations]      = data.error;
    convergence[data.iterations] = errors[data.iterations - this.options.reportFrequency] - data.error;
  });

  training.optimization.addReporter('finished-optimization', function (event, data) {
    trainingError = data.error;
    iterations    = data.iterations;
    development   = data.development;
  });

  trainingTime = process.hrtime();
  trainingResult = training.run(trainingSet);
  trainingTime = process.hrtime(trainingTime);

  trainingResult.training.setExamples(testSet);
  testError = trainingResult.getError();

  executionTime = process.hrtime();
  trainingResult.getNetwork().run(testSet[0].input);
  executionTime = process.hrtime(executionTime);

  analysisResult = new AnalysisResult(this, {
    trainingError : trainingError,
    testError     : testError,
    errors        : errors,
    convergence   : convergence,
    iterations    : iterations,
    development   : development,
    trainingTime  : trainingTime[0] + trainingTime[1] * 1e-9,
    executionTime : executionTime[0] + executionTime[1] * 1e-9
  });

  return analysisResult;
};

exports = module.exports = Analysis;
