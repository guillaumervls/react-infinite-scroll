function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

module.exports = function (React) {
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
      var el = this.getDOMNode();
      var scrollEl = window;

      var scrollTop = (scrollEl.pageYOffset !== undefined) ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      var offset = topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
      if(this.props.useWindow == false) {
        scrollEl = el.parentNode;
        offset = el.getBoundingClientRect().top + el.offsetHeight - el.parentNode.clientHeight;
      }

      if (offset < Number(this.props.threshold)) {
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

      var scrollEl = window;
      if(this.props.useWindow == false) {
        scrollEl = this.getDOMNode().parentNode;
      }

      scrollEl.addEventListener('scroll', this.scrollListener);
      scrollEl.addEventListener('resize', this.scrollListener);
      this.scrollListener();
    },
    detachScrollListener: function () {
      var scrollEl = window;
      if(this.props.useWindow == false) {
        scrollEl = this.getDOMNode().parentNode;
      }

      scrollEl.removeEventListener('scroll', this.scrollListener);
      scrollEl.removeEventListener('resize', this.scrollListener);
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