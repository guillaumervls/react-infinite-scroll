function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}


var InfiniteScroll = React.createClass({
  displayName: 'InfiniteScroll',
  propTypes: {
    pageStart: React.PropTypes.number,
    threshold: React.PropTypes.number,
    loadMore: React.PropTypes.func.isRequired,
    hasMore: React.PropTypes.bool
  },
  getDefaultProps: function () {
    return {
      pageStart: 0,
      hasMore: false,
      threshold: 250
    };
  },
  componentDidMount: function () {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
  },
  componentDidUpdate: function () {
    this.attachScrollListener();
  },
  render: function () {
    var props = this.props;
    return React.DOM.div(null, props.children, props.hasMore && (props.loader || InfiniteScroll._defaultLoader));
  },
  scrollListener: function () {
    var el = this.getDOMNode();
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
      this.detachScrollListener();
      // call loadMore after detachScrollListener to allow
      // for non-async loadMore functions
      this.props.loadMore(this.pageLoaded += 1);
    }
  },
  attachScrollListener: function () {
    if (!this.props.hasMore) {
      return;
    }
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.scrollListener);
    this.scrollListener();
  },
  detachScrollListener: function () {
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.scrollListener);
  },
  componentWillUnmount: function () {
    this.detachScrollListener();
  }
});
InfiniteScroll.setDefaultLoader = function (loader) {
  InfiniteScroll._defaultLoader = loader;
};

module.exports = InfiniteScroll