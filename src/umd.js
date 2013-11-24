/*global define*/
var reactInfiniteScroll = require('./react-infinite-scroll');
if (typeof define === 'function' && define.amd) {
  define(['react'], function (React) {
    return reactInfiniteScroll(React);
  });
} else {
  window.React.addons = window.React.addons || {};
  window.React.addons.InfiniteScroll = reactInfiniteScroll(window.React);
}