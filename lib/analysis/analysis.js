var _ = require('underscore');

var Examples            = require('../examples')
  , ReportEmitter       = require('../report-emitter')
  , AnalysisResult      = require('./result')
  , ClassificationError = require('../algorithms').ClassificationError;

var Analysis = function (training, options) {
  ReportEmitter.call(this);

  this.options = {};

  this.setOptions({
    testSetSize : 0.3,
    testSet     : [],
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
    , classificationError
    , testError
    , development
    , iterations
    , trainingTime
    , executionTime
    , training
    , network;

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

  convergence = [];
  errors      = [];

  // add reporters
  training.optimization.addReporter('optimization', function (event, data) {
    convergence.push([data.iterations, data.speed]);
    errors.push([data.iterations, data.error]);
  });

  training.optimization.addReporter('finished-optimization', function (event, data) {
    trainingError = data.error;
    iterations    = data.iterations;
    development   = data.development;

    training.optimization.resetReporters();
  });

  // measure training time with a resolution of nanoseconds
  trainingTime = process.hrtime();
  trainingResult = training.run(trainingSet);
  trainingTime = process.hrtime(trainingTime);

  // compute test error
  trainingResult.training.setExamples(testSet);
  testError = trainingResult.getError();

  network = trainingResult.getNetwork();

  // compute classification error
  classificationError = new ClassificationError(network, testSet);

  // measure execution time with a resolution of nanoseconds
  executionTime = process.hrtime();
  network.run(testSet[0].input);
  executionTime = process.hrtime(executionTime);

  // remove first element from convergence since invalid
  convergence.shift();

  analysisResult = new AnalysisResult(this, {
    trainingError       : trainingError,
    testError           : testError,
    classificationError : classificationError.run(),
    errors              : errors,
    convergence         : convergence,
    iterations          : iterations,
    development         : development,
    trainingTime        : trainingTime[0] + trainingTime[1] * 1e-9,
    executionTime       : executionTime[0] + executionTime[1] * 1e-9
  });

  return analysisResult;
};

exports = module.exports = Analysis;
