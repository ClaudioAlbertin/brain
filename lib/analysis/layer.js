var _              = require('underscore')
  , utils          = require('../utils')
  , AspectAnalysis = require('./aspect');

var LayerAnalysis = function (analysis, options) {
  AspectAnalysis.call(this, analysis, {
    layerStep  : 1,
    layerStart : 1,
    layerStop  : 3,
    unitStep   : 1,
    unitStart  : 2,
    unitStop   : 5
  });

  this.setOptions(options);
};

LayerAnalysis.prototype = new AspectAnalysis();

LayerAnalysis.prototype.getLayerMaps = function () {
  var layers
    , units
    , layerMaps
    , layerMap
    , i
    , l
    , j
    , m
    , k;

  layerMaps = [];

  layers = _.range(
    this.options.layerStart,
    this.options.layerStop + this.options.layerStep,
    this.options.layerStep
  );

  units = _.range(
    this.options.unitStart,
    this.options.unitStop + this.options.unitStep,
    this.options.unitStep
  );

  for (i = 0, l = layers.length; i < l; i++) {
    for (j = 0, m = units.length; j < m; j++) {
      layerMap = [];
      layerMap.push(this.analysis.training.network.layers[0]);

      for (k = 0; k < layers[i]; k++) {
        layerMap.push(units[j]);
      }

      layerMap.push(this.analysis.training.network.layers[this.analysis.training.network.layers.length - 1]);
      layerMaps.push(layerMap);
    }
  }

  return layerMaps;
};

LayerAnalysis.prototype.run = function () {
  var analyses
    , layerMaps
    , layers
    , name
    , i
    , l;

  analyses  = {};
  layerMaps = this.getLayerMaps();

  for (i = 0, l = layerMaps.length; i < l; i++) {
    layers = layerMaps[i];

    this.analysis.training.network.layers = layers;
    this.analysis.training.network.setWeights(utils.randomWeights(layers));

    name = (layers.length - 2) + ' ' + layers[1];

    analyses[name] = this.analysis.run();

    this.report('analysis', {
      iterations : i + 1,
      value      : name,
      layerMap   : layers,
      layers     : layers.length - 2,
      units      : layers[1]
    });
  }

  return analyses;
};

exports = module.exports = LayerAnalysis;
