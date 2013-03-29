var _ = require('underscore');

var Examples = function (examples) {
  this.examples = examples;
  // save a copy
  this.unused   = _.clone(examples);
  this.sets     = {};
};

Examples.prototype.getSet = function (name, amount) {
  if (this.sets[name] === undefined) {
    var number
      , shuffle
      , result
      , i
      , l;

    result  = [];
    number  = (amount < 1) ? Math.floor(this.examples.length * amount) : amount;
    shuffle = _.shuffle(this.unused);

    for (i = 0, l = shuffle.length; i < l && i < number; i++) {
      result.push(shuffle.pop());
    }

    this.unused     = shuffle;
    this.sets[name] = result;
  }

  return this.sets[name];
};

Examples.prototype.toArray = function () {
  return this.examples;
};

exports = module.exports = Examples;
