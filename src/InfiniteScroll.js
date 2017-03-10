import React, { Component, PropTypes } from 'react';

export default class InfiniteScroll extends Component {
    static propTypes = {
        element: PropTypes.string,
        hasMore: PropTypes.bool,
        initialLoad: PropTypes.bool,
        isReverse: PropTypes.bool,
        loadMore: PropTypes.func.isRequired,
        pageStart: PropTypes.number,
        threshold: PropTypes.number,
        useCapture: PropTypes.bool,
        useWindow: PropTypes.bool,
    };

    static defaultProps = {
        element: 'div',
        hasMore: false,
        initialLoad: true,
        pageStart: 0,
        threshold: 250,
        useWindow: true,
        isReverse: false,
        useCapture: false,
    };

    constructor(props) {
        super(props);

        this.scrollListener = this.scrollListener.bind(this);
    }

    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }

    componentDidUpdate() {
        this.attachScrollListener();
    }

    getParentElement(el) {
        return el.parentNode;
    }

    filterProps(props) {
        return props;
    }

    render() {
        const renderProps = this.filterProps(this.props);
        const {
            children,
            element,
            hasMore,
            initialLoad,
            isReverse,
            loader,
            loadMore,
            pageStart,
            threshold,
            useCapture,
            useWindow,
            ...props
        } = renderProps;

        props.ref = (node) => { this.scrollComponent = node; };

        return React.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
    }

    calculateTopPosition(el) {
        if(!el) {
            return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }

    scrollListener() {
        const el = this.scrollComponent;
        const scrollEl = window;
        const parentNode = this.getParentElement(el);

        let offset;
        if(this.props.useWindow) {
            var scrollTop = (scrollEl.pageYOffset !== undefined) ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            if (this.props.isReverse)
                offset = scrollTop;
            else
                offset = this.calculateTopPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
        } else {
            if (this.props.isReverse)
                offset = parentNode.scrollTop;
            else
                offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
        }

        if(offset < Number(this.props.threshold)) {
            this.detachScrollListener();
            // Call loadMore after detachScrollListener to allow for non-async loadMore functions
            if(typeof this.props.loadMore == 'function') {
                this.props.loadMore(this.pageLoaded += 1);
            }
        }
    }

    attachScrollListener() {
        if(!this.props.hasMore || !this.getParentElement(this.scrollComponent)) {
            return;
        }

        let scrollEl = window;
        if(this.props.useWindow == false) {
            scrollEl = this.getParentElement(this.scrollComponent);
        }

        scrollEl.addEventListener('scroll', this.scrollListener, this.props.useCapture);
        scrollEl.addEventListener('resize', this.scrollListener, this.props.useCapture);

        if(this.props.initialLoad) {
            this.scrollListener();
        }
    }

    detachScrollListener() {
        var scrollEl = window;
        if(this.props.useWindow == false) {
            scrollEl = this.getParentElement(this.scrollComponent);
        }

        scrollEl.removeEventListener('scroll', this.scrollListener, this.props.useCapture);
        scrollEl.removeEventListener('resize', this.scrollListener, this.props.useCapture);
    }

    componentWillUnmount() {
        this.detachScrollListener();
    }

    // Set a defaut loader for all your `InfiniteScroll` components
    setDefaultLoader(loader) {
        this._defaultLoader = loader;
    }
}
