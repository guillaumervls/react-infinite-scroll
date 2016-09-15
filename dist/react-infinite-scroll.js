'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var InfiniteScroll = function (_React$Component) {
  _inherits(InfiniteScroll, _React$Component);

  function InfiniteScroll(props) {
    _classCallCheck(this, InfiniteScroll);

    var _this = _possibleConstructorReturn(this, (InfiniteScroll.__proto__ || Object.getPrototypeOf(InfiniteScroll)).call(this, props));

    _this.scrollListener = _this.scrollListener.bind(_this);
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
      var _props = this.props;
      var children = _props.children;
      var hasMore = _props.hasMore;
      var loader = _props.loader;
      var loadMore = _props.loadMore;
      var pageStart = _props.pageStart;
      var threshold = _props.threshold;
      var useWindow = _props.useWindow;

      var props = _objectWithoutProperties(_props, ['children', 'hasMore', 'loader', 'loadMore', 'pageStart', 'threshold', 'useWindow']);

      return _react2.default.DOM.div(props, children, hasMore && (loader || this._defaultLoader));
    }
  }, {
    key: 'scrollListener',
    value: function scrollListener() {
      var el = _reactDom2.default.findDOMNode(this);
      var scrollEl = window;

      var offset;
      if (this.props.useWindow == true) {
        var scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        offset = topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
      } else {
        offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
      }

      if (offset < Number(this.props.threshold)) {
        this.detachScrollListener();
        // call loadMore after detachScrollListener to allow
        // for non-async loadMore functions
        this.props.loadMore(this.pageLoaded += 1);
      }
    }
  }, {
    key: 'attachScrollListener',
    value: function attachScrollListener() {
      if (!this.props.hasMore) {
        return;
      }

      var scrollEl = window;
      if (this.props.useWindow == false) {
        scrollEl = _reactDom2.default.findDOMNode(this).parentNode;
      }

      scrollEl.addEventListener('scroll', this.scrollListener);
      scrollEl.addEventListener('resize', this.scrollListener);
      this.scrollListener();
    }
  }, {
    key: 'detachScrollListener',
    value: function detachScrollListener() {
      var scrollEl = window;
      if (this.props.useWindow == false) {
        scrollEl = _reactDom2.default.findDOMNode(this).parentNode;
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
}(_react2.default.Component);

exports.default = InfiniteScroll;

InfiniteScroll.PropTypes = {
  pageStart: _react2.default.PropTypes.number,
  hasMore: _react2.default.PropTypes.bool,
  loadMore: _react2.default.PropTypes.func.isRequired,
  threshold: _react2.default.PropTypes.number,
  useWindow: _react2.default.PropTypes.bool
};
InfiniteScroll.defaultProps = {
  pageStart: 0,
  hasMore: false,
  loadMore: function loadMore() {},
  threshold: 250,
  useWindow: true
};
module.exports = exports['default'];
