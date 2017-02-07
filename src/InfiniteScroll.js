import React, { Component, PropTypes } from 'react';

export default class InfiniteScroll extends Component {
    static propTypes = {
        element: PropTypes.string,
        hasMore: PropTypes.bool,
        initialLoad: PropTypes.bool,
        loadMore: PropTypes.func.isRequired,
        pageStart: PropTypes.number,
        threshold: PropTypes.number,
        useWindow: PropTypes.bool,
        isReverse: PropTypes.bool
    };

    static defaultProps = {
        element: 'div',
        hasMore: false,
        initialLoad: true,
        pageStart: 0,
        threshold: 250,
        useWindow: true,
        isReverse: false
    };

    constructor(props) {
        super(props);

        this.scrollListener = this.scrollListener.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }

    componentDidUpdate() {
        // this.attachScrollListener();
    }

    componentWillReceiveProps(nextProps) {
        // Attach if new children
        clearTimeout(this.timeoutIndex);
        const shouldUpdate = (
            this.props.children && nextProps.children &&
            (
                (this.props.children.length !== nextProps.children.length) ||
                (this.props.children.size !== nextProps.children.size) // For support ImmutableJS
            )
        )
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

    reset() {
        this.pageLoaded = this.props.pageStart;
    }

    setPageLoaded(page) {
        this.pageLoaded = page;
    }

    render() {
        const {
            children,
            element,
            hasMore,
            initialLoad,
            loader,
            loadMore,
            pageStart,
            threshold,
            useWindow,
            isReverse,
            ...props
        } = this.props;

        props.ref = (node) => { this.scrollComponent = node; };

        return React.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
    }

    calculateTopPosition(el) {
        if(!el) {
            return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }

    calculateOffsetHeight(el) {
        if(!el) {
          return 0;
        }
        return el.offsetHeight;
    }

    scrollListener() {
        const el = this.scrollComponent;
        const scrollEl = window;

        let offset;
        if(this.props.useWindow) {
            var scrollTop = (scrollEl.pageYOffset !== undefined) ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            if (this.props.isReverse)
                offset = scrollTop;
            else
                offset = this.calculateTopPosition(el) + this.calculateOffsetHeight(el) - scrollTop - window.innerHeight;
        } else {
            if (this.props.isReverse)
                offset = el.parentNode.scrollTop;
            else
                offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
        }

        if(offset < Number(this.props.threshold)) {
            this.detachScrollListener();
            // Call loadMore after detachScrollListener to allow for non-async loadMore functions
            if(typeof this.props.loadMore == 'function') {
                this.props.loadMore(this.pageLoaded += 1);
            }
        }
    }

    attachScrollListener(nextProps) {
        const hasMore = this.props.hasMore || (nextProps && nextProps.hasMore);
        if(!hasMore) {
            return;
        }

        let scrollEl = window;
        if(this.props.useWindow == false) {
            scrollEl = this.scrollComponent.parentNode;
        }

        scrollEl.addEventListener('scroll', this.scrollListener);
        scrollEl.addEventListener('resize', this.scrollListener);

        if(this.props.initialLoad) {
            this.scrollListener();
        }
    }

    detachScrollListener() {
        var scrollEl = window;
        if(this.props.useWindow == false) {
            scrollEl = this.scrollComponent.parentNode;
        }

        scrollEl.removeEventListener('scroll', this.scrollListener);
        scrollEl.removeEventListener('resize', this.scrollListener);
    }

    componentWillUnmount() {
        this.detachScrollListener();
    }

    // Set a defaut loader for all your `InfiniteScroll` components
    setDefaultLoader(loader) {
        this._defaultLoader = loader;
    }
}
