React Infinite Scroll
=====================

*React infinite scroll component*

Demo: http://jsfiddle.net/mb9vJ/2

# Getting started

### Classic :

The "ready to use" [script file](https://raw.github.com/guillaumervls/react-infinite-scroll/master/dist/react-infinite-scroll.min.js)
is in the `dist` folder.

Then :
```html
<script src='react-infinite-scroll.min.js'></script>
<script>
  var InfiniteScroll = React.addons.InfiniteScroll;
</script>
```

### [Browserify](https://github.com/substack/node-browserify) :
̀
Install : `npm install react-infinite-scroll`

Then :
```javascript
InfiniteScroll = require('react-infinite-scroll')(React);
```

### Also works with AMD (e.g [RequireJS](http://requirejs.org))

In this case, it will depend on `react`.


# Use in JSX

```html
<InfiniteScroll
    pageStart=0
    loadMore={loadFunc}
    hasMore={true || false}
    loader={<div className="loader">Loading ...</div>}
    useWindow={true || false}>
  {items} // <-- This is the "stuff" you want to load
</InfiniteScroll>
```

- `pageStart` : The page number corresponding to the initial `items`, defaults to `0`
                which means that for the first loading, `loadMore` will be called with `1`

- `loadMore(pageToLoad)` : This function is called when the user scrolls down
                           and we need to load stuff

- `hasMore` : Boolean stating if we should keep listening to scroll event and
              trying to load more stuff

- `loader` : Loader element to be displayed while loading stuff - You can use
             `InfiniteScroll.setDefaultLoader(loader);` to set a defaut loader
             for all your `InfiniteScroll` components

- `threshold` : The distance between the bottom of the page and the bottom of the
                window's viewport that triggers the loading of new stuff -
                *Defaults to `250`*

- `useWindow` : Boolean stating whether to add listeners to the window, or else, the DOMNode

## (Re)build

```
npm install
grunt dist
```