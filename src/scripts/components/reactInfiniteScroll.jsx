/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var InfiniteScroll = function () {
    return React.createClass({
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
}

module.exports = InfiniteScroll;
