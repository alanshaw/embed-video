# embed-video [![Build Status](http://img.shields.io/travis/alanshaw/embed-video.svg)](https://travis-ci.org/alanshaw/embed-video) [![devDependency Status](https://david-dm.org/alanshaw/embed-video/dev-status.svg)](https://david-dm.org/alanshaw/embed-video#info=devDependencies)

Get embed code for embedding youtube/vimeo/whatever video in websites from URL or ID.

Currently supports YouTube and Vimeo. Please pull request to add others!

[![browser support](https://ci.testling.com/alanshaw/embed-video.png)](https://ci.testling.com/alanshaw/embed-video)

## Example

```js
var embed = require("embed-video")

var vimeoUrl = "http://vimeo.com/19339941"
var youtubeUrl = "https://www.youtube.com/watch?v=twE64AuqE9A"

console.log(embed(vimeoUrl))
console.log(embed(youtubeUrl))

var vimeoId = "6964150"
var youtubeId = "9XeNNqeHVDw"

console.log(embed.vimeo(vimeoId))
console.log(embed.youtube(youtubeId))
```

Output:

```html
<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<iframe src="//www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen></iframe>
<iframe src="//player.vimeo.com/video/6964150" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>
```

## Usage

```js
var embed = require("embed-video")
```

### var embedCode = embed(url, [options])

Return an HTML fragment embed code (string) for the given video URL.

### var embedCode = embed.vimeo(id, [options])

Return an HTML fragment embed code (string) for the given _vimeo_ video ID.

### var embedCode = embed.youtube(id, [options])

Return an HTML fragment embed code (string) for the given _youtube_ video ID.

### var embedCode = embed.image(url, [options], callback)

Returns an HTML `<img>` tag (string) for the given url and the `src` in a callback. Works for **youtube** and **vimeo**.

```js
{
  src: http://img.youtube.com/vi/eob7V_WtAVg/default.jpg,
  html: <img src="http://img.youtube.com/vi/eob7V_WtAVg/default.jpg"/>
}
```

## Options

### query

Object to be serialized as a querystring and appended to the embedded content url.

#### Example

```js
console.log(embed.vimeo("19339941", {query: {portrait: 0, color: '333'}}))
```

Output:

```html
<iframe src="//player.vimeo.com/video/19339941?portrait=0&color=333" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

#### Youtube Image options

|option|image|
|:------|:-----:|
|default|![](http://img.youtube.com/vi/eob7V_WtAVg/default.jpg)|
|mqdefault|![](http://img.youtube.com/vi/eob7V_WtAVg/mqdefault.jpg)|
|hqdefault|![](http://img.youtube.com/vi/eob7V_WtAVg/hqdefault.jpg)|
|sddefault|![](http://img.youtube.com/vi/eob7V_WtAVg/sddefault.jpg)|
|maxresdefault|![](http://img.youtube.com/vi/eob7V_WtAVg/maxresdefault.jpg)|

```js
embedVideo.image('https://www.youtube.com/watch?v=ekETjYMo6QE', {image: 'mqdefault'}, function (err, thumbnail) {
  if (err) throw err
  console.log(thumbnail.src)
  // https://img.youtube.com/vi/ekETjYMo6QE/mqdefault.jpg
  console.log(thumbnail.html)
  // <img src="https://img.youtube.com/vi/ekETjYMo6QE/mqdefault.jpg"/>  
})
```

#### Vimeo Image options

|option|image|
|:---|:---|
|thumbnail_small|![](http://i.vimeocdn.com/video/122513613_100x75.jpg)|
|thumbnail_medium|![](http://i.vimeocdn.com/video/122513613_200x150.jpg)|
|thumbnail_large|![](http://i.vimeocdn.com/video/122513613_640.jpg)|

```js
embedVideo.image('https://vimeo.com/19339941', {image: 'thumbnail_medium'}, function (err, thumbnail) {
  if (err) throw err
  console.log(thumbnail.src)
  // http://i.vimeocdn.com/video/122513613_200x150.jpg
  console.log(thumbnail.html)
  // <img src="http://i.vimeocdn.com/video/122513613_200x150.jpg"/>
})
```
