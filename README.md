# embed-video [![Build Status](http://img.shields.io/travis/alanshaw/embed-video.svg?style=flat)](https://travis-ci.org/alanshaw/embed-video) [![devDependency Status](https://david-dm.org/alanshaw/embed-video/dev-status.svg?style=flat)](https://david-dm.org/alanshaw/embed-video#info=devDependencies)

Get embed code for embedding youtube/vimeo/whatever video in websites from URL or ID.

Currently supports YouTube and Vimeo. Please pull request to add others!

[![browser support](https://ci.testling.com/alanshaw/embed-video.png)](https://ci.testling.com/alanshaw/embed-video)

## Usage

###Node.js
```js
var embed = require("embed-video")
```
###Browser
```html
<!--minified-->
<script type="text/javascript" src="embed.video.min.js"></script>
<!--un-minified-->
<script type="text/javascript" src="embed.video.js"></script>

```


```js

var vimeoUrl = "http://vimeo.com/19339941"
var youtubeUrl = "https://www.youtube.com/watch?v=twE64AuqE9A"

/**
 * convert to iframe
 */
console.log(embed(vimeoUrl).vimeo())
console.log(embed(youtubeUrl).youtube())

var vimeoId = "6964150"
var youtubeId = "9XeNNqeHVDw"

console.log(embed(vimeoId).vimeo())
console.log(embed(youtubeId).youtube())

/**
 * extract id from url
 */
console.log(embed(vimeoUrl).id())
console.log(embed(youtubeUrl).id())
```

Output (respectively):

*Url and ID to iframe*:

```html
<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<iframe src="//www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen></iframe>

<iframe src="//player.vimeo.com/video/6964150" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>
```

*Url to ID*:

```
--> "19339941"
--> "twE64AuqE9A"
```

##Options

Defaults:
```js
{
    width:'100%',
    height:'100%',
    class: '',
    id:''
}
```

Usage:
```js
var vimeoUrl = "http://vimeo.com/19339941"
console.log(embed(vimeoUrl,{
    width:'250',
    height:'250'
}).vimeo())
```

Output

```html
<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="" id="" width="250" height="250"></iframe>
```

##Extending embed-video

To extend, simply add a parser to the `parsers` object. The parser must contain a `parse` function and should accept the `url` and a callback. It must also pass two arguments to the callback, namely the `id` and the `iframe` template. See example below:

```js
parsers:{
    vimeo: {
                parse: function(url, callback) {
                    url = (url.host == "vimeo.com") ? url.path.split("/")[1] : null;
                    return callback(url, '<iframe src="https://player.vimeo.com/video/{{eid}}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="{{class}}" id="{{id}}" width="{{width}}" height="{{height}}"></iframe>')
                }
            }
}
```

As you may have noticed, the iframe template contains mustache like syntax. This is also necessary for custom attributes. The usage for any available parser will look like the following:

```js
    embed(/*video url or id*/)./*name of parser*/();
```