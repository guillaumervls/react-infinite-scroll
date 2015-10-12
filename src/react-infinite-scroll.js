function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

module.exports = function (React, ReactDOM) {
  if (React.addons && React.addons.InfiniteScroll) {
    return React.addons.InfiniteScroll;
  }
  React.addons = React.addons || {};
  var InfiniteScroll = React.addons.InfiniteScroll = React.createClass({
    getDefaultProps: function () {
      return {
        pageStart: 0,
        hasMore: false,
        loadMore: function () {},
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
      var el = ReactDOM.findDOMNode(this);
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
  return InfiniteScroll;
};