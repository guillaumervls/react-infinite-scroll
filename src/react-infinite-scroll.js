module.exports = function (React) {
  return React.createClass({
    getInitialState: function () {
      return {
        loading: false
      };
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
      return React.DOM.div(null, this.props.children, this.state.loading && loaderElmt);
    }
  });
};