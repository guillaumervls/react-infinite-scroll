/** @jsx React.DOM */

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var InfiniteScroll = React.createClass({
    getDefaultProps: function () {
        var loader = (<div className='loader'>Loading...</div>);
        var refresher = (<div className='refresher'>Refreshing...</div>);
        return {
            hasMoreToLoad: false,
            hasMoreToRefresh: false,
            loadThreshold: 250,
            refreshThreshold: 250,
            loader : loader,
            refresher : refresher
        };
    },
    componentDidMount: function () {
        this.attachScrollListener();
    },
    componentDidUpdate: function () {
        this.attachScrollListener();
    },
    render: function () {
        var refreshing;
        if (this.props.hasMoreToRefresh) {
            refreshing = this.props.refresher
        }

        var loading;
        if (this.props.hasMoreToLoad) {
            loading = this.props.loader
        }

        return (
            <div>
                {refreshing}
                {this.props.children}
                {loading}
            </div>
            )
    },
    scrollListener: function () {
        var el = this.getDOMNode();
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.loadThreshold) && this.props.hasMoreToLoad) {
            this.detachScrollListener();
            this.props.loadMore();
        }
        if (scrollTop < Number(this.props.refreshThreshold) && this.props.hasMoreToRefresh) {
            this.detachScrollListener();
            this.props.refresh();
        }
    },
    attachScrollListener: function () {
        if (!this.props.hasMoreToLoad && !this.props.hasMoreToRefresh) {
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

function update() {
    var content = 'Update ' + moment().format('MMMM Do YYYY, h:mm:ss a');
    return <div className='samplePage'>{content}</div>
}

function createDiv(page) {
    var content = 'Hello page ' + page + ' !';
    return <div className='samplePage'>{content}</div>
}

var Wrapper = React.createClass({
    componentDidMount: function () {
        var that = this;
        setInterval(function () {
            that.setState({
                hasMoreToRefresh: !that.state.hasMoreToRefresh
            })
        }, 6000)
    },
    getInitialState: function () {
        return {
            hasMoreToRefresh: true,
            hasMoreToLoad: true,
            items: [createDiv(0)],
            pageLoaded: 0
        };
    },
    refresh: function () {
        setTimeout(function () {
            this.setState({
                items: [update()].concat(this.state.items)
            });
        }.bind(this), 200);
    },
    loadMore: function () {
        setTimeout(function () {
            this.setState({
                items: this.state.items.concat([createDiv(this.state.pageLoaded + 1)]),
                pageLoaded: this.state.pageLoaded + 1
            });
        }.bind(this), 200);
    },
    render: function () {
        return (<InfiniteScroll
        loadMore={this.loadMore}
        refresh={this.refresh}
        hasMoreToRefresh={this.state.hasMoreToRefresh}
        hasMoreToLoad={this.state.hasMoreToLoad}>
        {[null].concat(this.state.items)}
        </InfiniteScroll>)
    }
});

React.renderComponent(<Wrapper/>, document.body);