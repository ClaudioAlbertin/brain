var _ = require('underscore');

var ReportEmitter = function () {
  this.resetReporters();
};

/**
 * Adds a reporter
 * @param {Function} reporter Reporter
 */
ReportEmitter.prototype.addReporter = function (event, reporter) {
  if (typeof event === 'function') {
    reporter = event;
    event    = 'all';
  }

  if (!reporter) return this;
  if (this.reporters[event] === undefined) this.reporters[event] = [];

  this.reporters[event].push(reporter);

  return this;
};

ReportEmitter.prototype.addReporters = function (reporters) {
  this.reporters = _.clone(reporters);

  return this;
};

ReportEmitter.prototype.resetReporters = function () {
  this.reporters = {
    all: []
  };

  return this;
};

/**
 * Report information
 * @param {String} name Report name
 * @param {Object} data Information to report
 */
ReportEmitter.prototype.report = function (event, data) {
  var reporters
    , reporter
    , i;

  reporters = _.union(this.reporters.all, this.reporters[event]);

  for (i = 0; reporter = reporters[i]; i++) {
    reporter.call(this, event, data);
  }

  return this;
};

exports = module.exports = ReportEmitter;
