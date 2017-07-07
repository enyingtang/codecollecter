# spider

Simple chrome extension for displaying all linkable content on a page.

![spider.png](spider.png)

## How it works

When you click the chrome extension button, the extension injects a script into the current tab that grabs all links from:

```
// - a[href]
// - link[href]
// - script[src]
// - img[src]
// - iframe[src]
// - object[data]
// - embed[src]
// - frame[src]
// - source[src]
// - form[action]
```

These links are then normalized and sent back to the extension. The extension sorts them and displays them in the page.

## Contact

c0nrad@c0nrad.io