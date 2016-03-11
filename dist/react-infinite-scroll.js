'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var component;

var InfiniteScroll = function (_React$Component) {
  _inherits(InfiniteScroll, _React$Component);

  function InfiniteScroll(props) {
    _classCallCheck(this, InfiniteScroll);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InfiniteScroll).call(this, props));

    component = _this;
    return _this;
  }

  _createClass(InfiniteScroll, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.pageLoaded = this.props.pageStart;
      this.attachScrollListener();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.attachScrollListener();
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      return React.DOM.div(null, props.children, props.hasMore && (props.loader || this._defaultLoader));
    }
  }, {
    key: 'scrollListener',
    value: function scrollListener() {
      var el = ReactDOM.findDOMNode(component);
      var scrollEl = window;

      var offset;
      if (component.props.useWindow == true) {
        var scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        offset = topPosition(el) + el.offsetHeight - scrollTop - height;
      } else {
        offset = el.offsetHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
      }

      if (offset < Number(component.props.threshold)) {
        component.detachScrollListener();
        // call loadMore after detachScrollListener to allow
        // for non-async loadMore functions
        component.props.loadMore(component.pageLoaded += 1);
      }
    }
  }, {
    key: 'attachScrollListener',
    value: function attachScrollListener() {
      if (!component.props.hasMore) {
        return;
      }

      var scrollEl = window;
      if (component.props.useWindow == false) {
        scrollEl = ReactDOM.findDOMNode(this).parentNode;
      }

      scrollEl.addEventListener('scroll', this.scrollListener);
      scrollEl.addEventListener('resize', this.scrollListener);
      this.scrollListener();
    }
  }, {
    key: 'detachScrollListener',
    value: function detachScrollListener() {
      var scrollEl = window;
      if (component.props.useWindow == false) {
        scrollEl = ReactDOM.findDOMNode(this).parentNode;
      }

      scrollEl.removeEventListener('scroll', this.scrollListener);
      scrollEl.removeEventListener('resize', this.scrollListener);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.detachScrollListener();
    }
  }, {
    key: 'setDefaultLoader',
    value: function setDefaultLoader(loader) {
      this._defaultLoader = loader;
    }
  }]);

  return InfiniteScroll;
}(React.Component);

exports.default = InfiniteScroll;

InfiniteScroll.PropTypes = {
  pageStart: React.PropTypes.number,
  hasMore: React.PropTypes.bool,
  loadMore: React.PropTypes.func.isRequired,
  threshold: React.PropTypes.number,
  useWindow: React.PropTypes.bool
};
InfiniteScroll.defaultProps = {
  pageStart: 0,
  hasMore: false,
  loadMore: function loadMore() {},
  threshold: 250,
  useWindow: true
};
