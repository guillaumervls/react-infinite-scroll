React Infinite Scroller
=======================

[![npm](https://img.shields.io/npm/dt/react-infinite-scroller.svg?style=flat-square)](https://www.npmjs.com/package/react-infinite-scroller)
[![React Version](https://img.shields.io/badge/React-%5E0.14.0%20%7C%7C%20%5E15.0.1-blue.svg?style=flat-square)](https://www.npmjs.com/package/react)
[![npm](https://img.shields.io/npm/v/react-infinite-scroller.svg?style=flat-square)](https://www.npmjs.com/package/react-infinite-scroller)
[![npm](https://img.shields.io/npm/l/react-infinite-scroller.svg?style=flat-square)](https://github.com/CassetteRocks/react-infinite-scroller/blob/master/LICENSE)

Infinitely load content using a React Component. This fork maintains a simple, lightweight infinite scroll package that supports both `window` and scrollable elements.

## Installation

```
  npm i react-infinite-scroller
```

## How to use

The module supports ES6 imports with `jsnext:main` and require with `main` in the package.json.

```
  import InfiniteScroll from 'react-infinite-scroller'
```

### Window scroll events

```html
  <InfiniteScroll
      pageStart={0}
      loadMore={loadFunc}
      hasMore={true || false}
      loader={<div className="loader">Loading ...</div>}>
    {items} // <-- This is the content you want to load
  </InfiniteScroll>
```

### DOM scroll events

```html
  <div style="height:700px;overflow:auto;">
    <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={true || false}
        loader={<div className="loader">Loading ...</div>}
        useWindow={false}>
      {items}
    </InfiniteScroll>
  </div>
```

- `pageStart` : The page number corresponding to the initial `items`, defaults to `0`
                which means that for the first loading, `loadMore` will be called with `1`

- `loadMore(pageToLoad)` : This function is called when the user scrolls down
                           and we need to load items

- `hasMore` : Boolean stating whether there are more items to be loaded. Event listeners
              are removed if `false`.

- `loader` : Loader element to be displayed while loading items - You can use
             `InfiniteScroll.setDefaultLoader(loader);` to set a defaut loader
             for all your `InfiniteScroll` components

- `threshold` : The distance between the bottom of the page and the bottom of the
                window's viewport that triggers the loading of new items -
                *Defaults to `250`*

- `useWindow` : Boolean stating whether to add listeners to the window, or else, the DOMNode
