var fs   = require('fs')
  , path = require('path');

var AnalysisRunner = function (analysis) {
  this.analysis = analysis;
  this.aspects = {};
};

AnalysisRunner.prototype.addAspect = function (name, aspect) {
  if (aspect) {
    aspect.setAnalysis(this.analysis);
    this.aspects[name] = aspect;
  }

  return this;
};

AnalysisRunner.prototype.run = function () {
  var name
    , results;

  results = {};

  results.bare = this.analysis.run();

  for (name in this.aspects) {
    if (this.aspects.hasOwnProperty(name)) {
      results[name] = this.aspects[name].run();
    }
  }

  // cache results
  this.results = results;

  return results;
};

AnalysisRunner.prototype.toData = function () {
  var results
    , data
    , item
    , name
    , aspect
    , coords
    , lastCoords;

  data = {
    convergence : '',
    errors      : ''
  };

  results = this.results || this.run();

  for (item in results.bare.convergence) {
    if (results.bare.convergence.hasOwnProperty(item)) {
      // append content
      data.convergence += item + ' ' + results.bare.convergence[item] + '\n';
    }
  }

  for (item in results.bare.errors) {
    if (results.bare.errors.hasOwnProperty(item)) {
      // append content
      data.errors += item + ' ' + results.bare.errors[item] + '\n';
    }
  }

  for (name in results) {
    if (this.aspects.hasOwnProperty(name)) {
      data[name] = '';
      lastCoords = undefined;

      aspect = results[name];

      for (item in aspect) {
        if (aspect.hasOwnProperty(item)) {
          coords = item.toString().split(' ').map(parseInt);
          // add additional newline for 3D data
          if (coords.length === 2 && lastCoords !== undefined && coords[0] > lastCoords[0]) {
            data[name] += '\n';
          }

          // append content
          data[name] += item +
            ' ' + aspect[item].testError +
            ' ' + aspect[item].iterations +
            ' ' + aspect[item].development +
            ' ' + aspect[item].trainingTime +
            ' ' + aspect[item].executionTime +
            '\n';

          lastCoords = coords;
        }
      }
    }
  }

  return data;
};

AnalysisRunner.prototype.saveData = function (location) {
  var data
    , file;

  data = this.toData();

  if (!fs.existsSync(location)) fs.mkdirSync(location);

  for (file in data) {
    if (data.hasOwnProperty(file)) {
      fs.writeFileSync(path.join(location, file + '.dat'), data[file]);
    }
  }

  return this;
};

exports = module.exports = AnalysisRunner;
