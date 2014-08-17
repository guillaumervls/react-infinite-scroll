/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('./../styles/reset.css');
//require('./styles/main.css');

var Wrapper = require('./components/wrapper.jsx')();

React.renderComponent(<Wrapper />, document.getElementById('content')); // jshint ignore:line