module.exports = function (React) {
  if (React.addons && React.addons.InfiniteScroll) {
    return React.addons.InfiniteScroll;
  }
  React.addons = React.addons || {};
  React.addons.InfiniteScroll = React.createClass({
    getDefaultProps: function () {
      return {
        pageStart: 0,
        hasMore: false,
        loadMore: function () {},
        loader: React.DOM.span,
        threshold: 250
      };
    },
    getInitialState: function () {
      this.pageLoaded = this.props.pageStart;
    },
    componentDidMount: function () {
      this.attachScrollListener();
    },
    componentDidUpdate: function () {
      this.attachScrollListener();
    },
    render: function () {
      var loaderProp = this.props.loader,
        loaderElmt;
      if (typeof loaderProp === 'function') {
        loaderElmt = loaderProp();
      } else if (typeof loaderProp === 'object') {
        loaderElmt = loaderProp.component(loaderProp.props, loaderProp.children);
      }
      return React.DOM.div(null, this.props.children, this.props.hasMore && loaderElmt);
    },
    scrollListener: function () {
      if (document.body.offsetHeight - document.body.scrollTop - window.innerHeight < Number(this.props.threshold)) {
        this.props.loadMore(this.pageLoaded += 1);
        this.detachScrollListener();
      }
    },
    attachScrollListener: function () {
      if (!this.props.hasMore) {
        return;
      }
      window.addEventListener('scroll', this.scrollListener);
      this.scrollListener();
    },
    detachScrollListener: function () {
      window.removeEventListener('scroll', this.scrollListener);
    },
    componentWillUnmount: function () {
      this.detachScrollListener();
    }
  });
  return React.addons.InfiniteScroll;
};