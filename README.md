# brain.js [![Build Status](https://img.shields.io/travis/ClaudioAlbertin/brainjs.svg)](https://travis-ci.org/ClaudioAlbertin/brainjs) [![Dependencies](https://img.shields.io/david/ClaudioAlbertin/brainjs.svg)](https://david-dm.org/ClaudioAlbertin/brainjs)

Flexible library for creating, training and analyzing multi-layer feed-forward artificial neural networks.

## Usage

### Setup

Simply install the package from npm…

```
$ npm install brainjs
```

…and require it in your application:

```js
const brain = require('brainjs');
```

### Initialising a network

Networks consist of an array describing the number and size of its layers, a matrix of weights and an activation function used in the neurons.

Internally [sylvester](http://sylvester.jcoglan.com) is used for matrix operations and matrices (and vectors) taken as arguments are expected to be sylvester objects.
Sylvester is exported at `brain.sylvester` and shortcuts to the `Matrix` and `Vector` classes are provided at `brain.Matrix` and `brain.Vector` respectively.

```js
let inputs = new brain.Vector([2, 5, 6, 4, 3]);

let weights = new brain.Matrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]);
```

To create a network, pass an array describing the desired layers where every element of the array is an integer specifying the number of neurons in the layer corresponding to the element's index, as well as some weights:

```js
let network = new brain.Network([2, 4, 1], weights);
```

This would correspond to the following network topology featuring two input neurons, a single output neuron, a hidden layer consisitig of foursc neurons, as well as bias neurons for every layer but the last one:

```
    ◆
◆   o
o   o
o   o   o
    o
```

The activation function is automatically set to a sigmoid function which is a solid choice for most applications, however it can be changed using `setActivation()`:

```js
network.setActivation((x) => {
  return Math.round(x) * 2 - 1
});
```

When creating a network from scratch you will want to initialise it with random weights. This library provides a handy utility function for this task, which takes an array of layers as its argument:

```js
let weights = brain.utils.randomWeights([2, 4, 1]);
```

Alternatively, to load a network that has already been specified, potentially trained, and saved to a JSON file, simply do:

```js
let network = brain.Network.fromJSON(require('./xnor'));
```

*Note that due to the way `require()` works in node.js the `.json` file extension is not required, however the file path must start with `.` or `/` to not be considered an npm module.*

### Executing a network

Network execution is straight forward. Given a vector of inputs, calling `run()` on a network returns the computed outputs as another vector:

```js
let inputs  = new brain.sylvester.Vector([1, 0]);
let outputs = network.run(inputs);
```
