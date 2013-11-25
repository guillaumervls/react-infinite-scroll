module.exports = function (React) {
  return React.createClass({
    getInitialState: function () {
      this.pageLoaded = this.props.pageStart || 0;
      return {
        pageLoaded: this.props.pageStart || 0
      };
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
      } else {
        loaderElmt = React.DOM.span();
      }
      return React.DOM.div(null, this.props.children, this.props.hasMore && loaderElmt);
    },
    scrollListener: function () {
      if (document.body.offsetHeight - document.body.scrollTop - window.innerHeight < 250) {
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
    }
  });
};