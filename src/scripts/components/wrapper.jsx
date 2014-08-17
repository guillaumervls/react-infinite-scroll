/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var InfiniteScroll = require('./reactInfiniteScroll.jsx')();
var moment = require('moment/moment');
var _ = require('lodash');

var i = 0;
function update() {
    var content = 'Update ' + moment().format('MMMM Do YYYY, h:mm:ss a');
    ++i;
    return <div key={i} className='samplePage'>{content}</div>
}

function createDiv(page) {
    var content = 'Hello page ' + page + ' !';
    ++i;
    return <div key={i} className='samplePage'>{content}</div>
}

var Wrapper = function () {
    return React.createClass({
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
                {this.state.items}
            </InfiniteScroll>)
        }
    });
}

module.exports = Wrapper;