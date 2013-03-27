var Analysis = function (training) {
  this.setTraining(training);
};

Analysis.prototype.setTraining = function (training) {
  this.training = training || this.training;

  return this;
};

Analysis.prototype.run = function () {
  this.training.cost.addReporter();
  this.training.derivative.addReporter();
  this.training.optimization.addReporter();

};

exports = module.exports = Analysis;
