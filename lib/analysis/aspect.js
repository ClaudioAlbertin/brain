var AspectAnalysis = function (training) {
  this.setTraining(training);
};

AspectAnalysis.prototype.setTraining = function (training) {
  this.training = training || this.training;

  return this;
};

AspectAnalysis.prototype.run = function () {

};

exports = module.exports = AspectAnalysis;
