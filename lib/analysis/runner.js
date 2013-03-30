var fs    = require('fs')
  , path  = require('path');

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
    , aspect
    , coords
    , lastCoords
    , analysis
    , value
    , name
    , legend
    , i
    , l;

  data = {
    convergence : ['iterations', 'convergence'].join(' ') + '\n',
    errors      : ['iterations', 'error'].join(' ') + '\n'
  };

  results = this.results || this.run();

  analysis = results.bare.toJSON();

  for (i = 0, l = analysis.convergence.length; i < l; i++) {
    // append content
    data.convergence += analysis.convergence[i].join(' ') + '\n';
  }

  for (i = 0, l = analysis.errors.length; i < l; i++) {
    // append content
    data.errors += analysis.errors[i].join(' ') + '\n';
  }

  for (name in results) {
    if (this.aspects.hasOwnProperty(name)) {
      data[name] = '';
      legend     = [
        'testError',
        'trainingError',
        'convergenceAvg',
        'finalConvergence',
        'iterations',
        'development',
        'trainingTime',
        'executionTime'
      ];

      lastCoords = undefined;

      aspect = results[name];

      for (i = 0, l = aspect.length; i < l; i++) {
        value    = aspect[i];
        coords   = value.slice(0, -1);
        analysis = value[value.length - 1].toJSON();

        // insert additional newline for 3D data
        if (coords.length === 2 && lastCoords !== undefined && coords[0] > lastCoords[0]) {
          data[name] += '\n';
        }

        lastCoords = coords;

        // append content
        data[name] += coords.join(' ') +
          ' ' + analysis.testError +
          ' ' + analysis.trainingError +
          ' ' + analysis.convergenceAvg +
          ' ' + analysis.finalConvergence +
          ' ' + analysis.iterations +
          ' ' + analysis.development +
          ' ' + analysis.trainingTime +
          ' ' + analysis.executionTime +
          '\n';
      }

      if (coords.length === 2) {
        legend.unshift('y');
      }

      legend.unshift('x');
      data[name] = legend.join(' ') + '\n' + data[name];
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
