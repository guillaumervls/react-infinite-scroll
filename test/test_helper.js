/*eslint-disable*/
require('babel-register')();
var chai = require('chai');
var JSDOM = require('jsdom').JSDOM;
var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
var exposedProperties = ['window', 'navigator', 'document'];

Enzyme.configure({ adapter: new Adapter() });

global.dom = new JSDOM('<body></body>');
global.window = dom.window.document.defaultView;

Object.keys(dom.window.document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = dom.window.document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
