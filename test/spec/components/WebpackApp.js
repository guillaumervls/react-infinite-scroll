'use strict';

describe('Main', function () {
  var WebpackApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    WebpackApp = require('../../../src/scripts/components/WebpackApp.jsx');
    component = WebpackApp();
  });

  it('should create a new instance of WebpackApp', function () {
    expect(component).toBeDefined();
  });
});
