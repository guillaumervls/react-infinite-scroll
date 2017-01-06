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
    loader={<div className="loader">Loading ...</div>}>
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


## Changelog

### v0.1.0

`loader` now takes a React component
(no more component constructor or object `{component:... , props:... , ...}`).


## (Re)build

```
npm install
grunt dist
```

### Licence

**The MIT License (MIT)**

*Copyright (c) 2013 guillaumervls*

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
