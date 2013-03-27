var AspectAnalysis = require('./aspect');

var CostAnalysis = function () {
  AspectAnalysis.call(this);
};

CostAnalysis.prototype = new AspectAnalysis();

exports = module.exports = CostAnalysis;
