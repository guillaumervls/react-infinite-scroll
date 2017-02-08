'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfiniteScroll = function (_Component) {
    _inherits(InfiniteScroll, _Component);

    function InfiniteScroll(props) {
        _classCallCheck(this, InfiniteScroll);

        var _this2 = _possibleConstructorReturn(this, (InfiniteScroll.__proto__ || Object.getPrototypeOf(InfiniteScroll)).call(this, props));

        _this2.scrollListener = _this2.scrollListener.bind(_this2);
        _this2.reset = _this2.reset.bind(_this2);
        return _this2;
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
            // this.attachScrollListener();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // Attach if new children
            clearTimeout(this.timeoutIndex);
            var shouldUpdate = this.props.children && nextProps.children && (this.props.children.length !== nextProps.children.length || this.props.children.size !== nextProps.children.size // For support ImmutableJS
            );
            if (shouldUpdate) {
                var _this = this;
                this.timeoutIndex = setTimeout(function () {
                    _this.attachScrollListener();
                }, 250);
            }
            // Attach if availability change
            if (this.props.hasMore !== nextProps.hasMore) {
                // Pass next props to evaluate before props get it
                this.attachScrollListener(nextProps);
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.pageLoaded = this.props.pageStart;
        }
    }, {
        key: 'setPageLoaded',
        value: function setPageLoaded(page) {
            this.pageLoaded = page;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props;
            var children = _props.children;
            var element = _props.element;
            var hasMore = _props.hasMore;
            var initialLoad = _props.initialLoad;
            var loader = _props.loader;
            var loadMore = _props.loadMore;
            var pageStart = _props.pageStart;
            var threshold = _props.threshold;
            var useWindow = _props.useWindow;
            var isReverse = _props.isReverse;

            var props = _objectWithoutProperties(_props, ['children', 'element', 'hasMore', 'initialLoad', 'loader', 'loadMore', 'pageStart', 'threshold', 'useWindow', 'isReverse']);

            props.ref = function (node) {
                _this3.scrollComponent = node;
            };

            return _react2.default.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
        }
    }, {
        key: 'calculateTopPosition',
        value: function calculateTopPosition(el) {
            if (!el) {
                return 0;
            }
            return el.offsetTop + this.calculateTopPosition(el.offsetParent);
        }
    }, {
        key: 'calculateOffsetHeight',
        value: function calculateOffsetHeight(el) {
            if (!el) {
                return 0;
            }
            return el.offsetHeight;
        }
    }, {
        key: 'scrollListener',
        value: function scrollListener() {
            var el = this.scrollComponent;
            var scrollEl = window;

            var offset = void 0;
            if (this.props.useWindow) {
                var scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                if (this.props.isReverse) offset = scrollTop;else offset = this.calculateTopPosition(el) + this.calculateOffsetHeight(el) - scrollTop - window.innerHeight;
            } else {
                if (this.props.isReverse) offset = el.parentNode.scrollTop;else offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
            }

            if (offset < Number(this.props.threshold)) {
                this.detachScrollListener();
                // Call loadMore after detachScrollListener to allow for non-async loadMore functions
                if (typeof this.props.loadMore == 'function') {
                    this.props.loadMore(this.pageLoaded += 1);
                }
            }
        }
    }, {
        key: 'attachScrollListener',
        value: function attachScrollListener(nextProps) {
            var hasMore = this.props.hasMore || nextProps && nextProps.hasMore;
            if (!hasMore) {
                return;
            }

            var scrollEl = window;
            if (this.props.useWindow == false) {
                scrollEl = this.scrollComponent.parentNode;
            }

            scrollEl.addEventListener('scroll', this.scrollListener);
            scrollEl.addEventListener('resize', this.scrollListener);

            if (this.props.initialLoad) {
                this.scrollListener();
            }
        }
    }, {
        key: 'detachScrollListener',
        value: function detachScrollListener() {
            var scrollEl = window;
            if (this.props.useWindow == false) {
                scrollEl = this.scrollComponent.parentNode;
            }

            scrollEl.removeEventListener('scroll', this.scrollListener);
            scrollEl.removeEventListener('resize', this.scrollListener);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.detachScrollListener();
        }

        // Set a defaut loader for all your `InfiniteScroll` components

    }, {
        key: 'setDefaultLoader',
        value: function setDefaultLoader(loader) {
            this._defaultLoader = loader;
        }
    }]);

    return InfiniteScroll;
}(_react.Component);

InfiniteScroll.propTypes = {
    element: _react.PropTypes.string,
    hasMore: _react.PropTypes.bool,
    initialLoad: _react.PropTypes.bool,
    loadMore: _react.PropTypes.func.isRequired,
    pageStart: _react.PropTypes.number,
    threshold: _react.PropTypes.number,
    useWindow: _react.PropTypes.bool,
    isReverse: _react.PropTypes.bool
};
InfiniteScroll.defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    threshold: 250,
    useWindow: true,
    isReverse: false
};
exports.default = InfiniteScroll;
module.exports = exports['default'];
