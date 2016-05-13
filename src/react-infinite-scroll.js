import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

class InfiniteScroll extends Component {

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;

    this.attachScrollListener();
  }

  componentDidUpdate() {
    this.pageLoaded = this.props.pageStart;

    this.attachScrollListener();
  }

  render() {
    var props = this.props;

    return React.DOM.div(null, props.children, props.hasMore && (props.loader || InfiniteScroll._defaultLoader));
  }

  scrollListener() {
    var el = ReactDOM.findDOMNode(this);

    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
      this.detachScrollListener();

      // call loadMore after detachScrollListener to allow
      // for non-async loadMore functions
      this.props.loadMore(this.pageLoaded += 1);
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      return;
    }
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.scrollListener);

    //this.scrollListener();
  }

  detachScrollListener() {
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.scrollListener);
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }
}

InfiniteScroll.PropTypes = {
  pageStart: PropTypes.number,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  threshold: PropTypes.number,
  useWindow: PropTypes.bool
};

InfiniteScroll.defaultProps = {
  pageStart: 0,
  pageLoaded: 0,
  hasMore: false,
  threshold: 250,
  loadMore: () => {
  }
};

export default InfiniteScroll;