# embed-video

[![Build Status](http://img.shields.io/travis/alanshaw/embed-video.svg)](https://travis-ci.org/alanshaw/embed-video) [![devDependency Status](https://david-dm.org/alanshaw/embed-video/dev-status.svg)](https://david-dm.org/alanshaw/embed-video#info=devDependencies) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Get embed code for embedding youtube/vimeo/dailymotion/whatever video in websites from URL or ID.

Currently supports YouTube, Vimeo and DailyMotion. Please pull request to add others!

## Example

```js
var embed = require("embed-video")

var vimeoUrl = "http://vimeo.com/19339941"
var youtubeUrl = "https://www.youtube.com/watch?v=twE64AuqE9A"
var dailymotionUrl = "https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport"

console.log(embed(vimeoUrl))
console.log(embed(youtubeUrl))
console.log(embed(dailymotionUrl))

var vimeoId = "6964150"
var youtubeId = "9XeNNqeHVDw"
var dailymotionId = "x20qnej"

console.log(embed.vimeo(vimeoId))
console.log(embed.youtube(youtubeId))
console.log(embed.dailymotion(dailymotionId))
```

Output:

```html
<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<iframe src="//www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen></iframe>
<iframe src="//www.dailymotion.com/embed/video/x20qnej" frameborder="0" allowfullscreen></iframe>
<iframe src="//player.vimeo.com/video/6964150" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>
<iframe src="//www.dailymotion.com/embed/video/x20qnej" frameborder="0" allowfullscreen></iframe>
```

## Usage

```js
var embed = require("embed-video")
```

### embed(url, [options])

Return an HTML fragment embed code (string) for the given video URL. Returns `undefined` if unrecognised.

### embed.image(url, [options], callback)

Returns an HTML `<img>` tag (string) for the given url and the `src` in a callback. Works for **youtube**, **vimeo** and **dailymotion**. Returns `undefined` if unrecognised.

```js
{
  src: http://img.youtube.com/vi/eob7V_WtAVg/default.jpg,
  html: <img src="http://img.youtube.com/vi/eob7V_WtAVg/default.jpg"/>
}
```

### embed.info(url)

Returns an `object` containing the video ID, video source (`"youtube"`, `"vimeo"`, `"dailymotion"`), and the original url. Works for **youtube**, **vimeo** and **dailymotion**. Returns `undefined` if unrecognised.

```js
{
  id: String,
  url: String,
  source: Enum "youtube", "vimeo", "dailymotion"
}
```

## Options

### `query`

Object to be serialized as a querystring and appended to the embedded content url.


#### Example

```js
console.log(embed.vimeo("19339941", {query: {portrait: 0, color: '333'}}))
```

Output:

```html
<iframe src="//player.vimeo.com/video/19339941?portrait=0&color=333" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```
### `attr`

Object to add additional attributes (any) to the iframe

#### Example

```js
console.log(embed('https://youtu.be/jglUWD3KMh4', {query: {portrait: 0, color: '333'}, attr:{width:400, height:200}}))
```

Output:
```html
<iframe src="//www.youtube.com/embed/jglUWD3KMh4?portrait=0&color=333" frameborder="0" allowfullscreen width="400" height="200"></iframe>
```

### `image`

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

#### DailyMotion Image options

|option|image|
|:---|:---|
|thumbnail_60_url|![](http://s1.dmcdn.net/IgPVQ/x60-oZg.jpg)|
|thumbnail_120_url|![](http://s1.dmcdn.net/IgPVQ/x120-llF.jpg)|
|thumbnail_180_url|![](http://s1.dmcdn.net/IgPVQ/x180-DpY.jpg)|
|thumbnail_240_url|![](http://s1.dmcdn.net/IgPVQ/x240-JCj.jpg)|
|thumbnail_360_url|![](http://s1.dmcdn.net/IgPVQ/x360-s-z.jpg)|
|thumbnail_480_url|![](http://s1.dmcdn.net/IgPVQ/x480-ktj.jpg)|
|thumbnail_720_url|![](http://s1.dmcdn.net/IgPVQ/x720-d_h.jpg)|
|thumbnail_1080_url|![](http://s1.dmcdn.net/IgPVQ/x1080-HsJ.jpg)|

```js
embedVideo.image('https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport', {image: 'thumbnail_720_url'}, function (err, thumbnail) {
  if (err) throw err
  console.log(thumbnail.src)
  // http://s1.dmcdn.net/IgPVQ/x720-d_h.jpg
  console.log(thumbnail.html)
  // <img src="http://s1.dmcdn.net/IgPVQ/x720-d_h.jpg"/>
})
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/embed-video/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
