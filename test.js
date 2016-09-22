var test = require("tape")
var embed = require("./")

test("convert vimeo.com url", function (t) {
  t.plan(1)
  var code = embed("http://vimeo.com/19339941")
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test("convert youtube.com url", function (t) {
  t.plan(1)
  var code = embed("https://www.youtube.com/watch?v=twE64AuqE9A")
  t.equal(code, '<iframe src="//www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen></iframe>')
})

test("convert youtu.be url", function (t) {
  t.plan(1)
  var code = embed("http://youtu.be/9XeNNqeHVDw#aid=P-Do3JLm4A0")
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>')
})

test("convert vimeo id", function (t) {
  t.plan(1)
  var code = embed.vimeo("19339941")
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test("convert youtube id", function (t) {
  t.plan(1)
  var code = embed.youtube("9XeNNqeHVDw")
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>')
})

test("accept query param youtube", function (t) {
  t.plan(1)
  var code = embed.youtube("9XeNNqeHVDw", { query: { rel: 0, showinfo: 0 } } )
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>')
})

test("accept query param vimeo", function (t) {
  t.plan(1)
  var code = embed.vimeo("19339941", { query: { portrait: 0, color: '333' } } )
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941?portrait=0&color=333" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test("get vimeo thumbnail", function (t) {
  t.plan(3)
  embed.image('https://vimeo.com/19339941', function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.src, '//i.vimeocdn.com/video/122513613_640.jpg', 'embed.image returns an object with a src')
    t.equal(thumbnail.html, '<img src="//i.vimeocdn.com/video/122513613_640.jpg"/>', 'and an html tag')
  })
})

test("get vimeo thumbnail with options", function (t) {
  t.plan(2)
  embed.image('https://vimeo.com/19339941', {image: 'thumbnail_small'}, function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.html, '<img src="//i.vimeocdn.com/video/122513613_100x75.jpg"/>', 'correctly applys options thumbnail')
  })
})

test("get default vimeo thumbnail with invalid options", function (t) {
  t.plan(2)
  embed.image('https://vimeo.com/19339941', {image: 'what-rubbish'}, function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.html, '<img src="//i.vimeocdn.com/video/122513613_640.jpg"/>', 'correctly applys options thumbnail')
  })
})

test("get youtube thumbnail (prove backwards compatibility)", function (t) {
  t.plan(1)
  var embedImage = embed.image('https://youtu.be/ZeLnjXTNq6Q', {image: 'maxresdefault'})
  t.equal(embedImage, '<img src="//img.youtube.com/vi/ZeLnjXTNq6Q/maxresdefault.jpg"/>', 'retains synchronous behaviour and returns html image tag')
})
