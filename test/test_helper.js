/*eslint-disable*/
require('babel-register')();
var chai = require('chai');
var jsdom = require('jsdom').jsdom;
var chaiEnzyme = require('chai-enzyme');
var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('<body></body>');
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

chai.use(chaiEnzyme());