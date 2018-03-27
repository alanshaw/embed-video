var test = require('tape')
var embed = require('./')

test('convert vimeo.com url', function (t) {
  t.plan(1)
  var code = embed('http://vimeo.com/19339941')
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test('convert youtube.com url', function (t) {
  t.plan(1)
  var code = embed('https://www.youtube.com/watch?v=twE64AuqE9A')
  t.equal(code, '<iframe src="//www.youtube.com/embed/twE64AuqE9A" frameborder="0" allowfullscreen></iframe>')
})

test('convert youtu.be url', function (t) {
  t.plan(1)
  var code = embed('http://youtu.be/9XeNNqeHVDw#aid=P-Do3JLm4A0')
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>')
})

test('convert dailymotion.com url', function (t) {
  t.plan(1)
  var code = embed('https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport')
  t.equal(code, '<iframe src="//www.dailymotion.com/embed/video/x20qnej" frameborder="0" allowfullscreen></iframe>')
})

test('convert dai.ly url', function (t) {
  t.plan(1)
  var code = embed('http://dai.ly/x20qnej')
  t.equal(code, '<iframe src="//www.dailymotion.com/embed/video/x20qnej" frameborder="0" allowfullscreen></iframe>')
})

test('convert vimeo id', function (t) {
  t.plan(1)
  var code = embed.vimeo('19339941')
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test('convert youtube id', function (t) {
  t.plan(1)
  var code = embed.youtube('9XeNNqeHVDw')
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw" frameborder="0" allowfullscreen></iframe>')
})

test('convert dailymotion id', function (t) {
  t.plan(1)
  var code = embed.dailymotion('x20qnej')
  t.equal(code, '<iframe src="//www.dailymotion.com/embed/video/x20qnej" frameborder="0" allowfullscreen></iframe>')
})

test('accept query param youtube', function (t) {
  t.plan(1)
  var code = embed.youtube('9XeNNqeHVDw', { query: { rel: 0, showinfo: 0 } })
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>')
})

test('accept attributes youtube', function (t) {
  t.plan(1)
  var code = embed.youtube('9XeNNqeHVDw', { query: { rel: 0, showinfo: 0 }, attr: { width: 400, height: 200 } })
  t.equal(code, '<iframe src="//www.youtube.com/embed/9XeNNqeHVDw?rel=0&showinfo=0" width="400" height="200" frameborder="0" allowfullscreen></iframe>')
})

test('accept query param vimeo', function (t) {
  t.plan(1)
  var code = embed.vimeo('19339941', { query: { portrait: 0, color: '333' } })
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941?portrait=0&color=333" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test('accept attributes vimeo', function (t) {
  t.plan(1)
  var code = embed.vimeo('19339941', { query: { portrait: 0, color: '333' }, attr: { width: 400, height: 200 } })
  t.equal(code, '<iframe src="//player.vimeo.com/video/19339941?portrait=0&color=333" width="400" height="200" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
})

test('accept query param dailymotion', function (t) {
  t.plan(1)
  var code = embed.dailymotion('x20qnej', { query: { autoPlay: 1, start: 66 } })
  t.equal(code, '<iframe src="//www.dailymotion.com/embed/video/x20qnej?autoPlay=1&start=66" frameborder="0" allowfullscreen></iframe>')
})

test('accept attributes dailymotion', function (t) {
  t.plan(1)
  var code = embed.dailymotion('x20qnej', { query: { autoPlay: 1, start: 66 }, attr: { width: 400, height: 200 } })
  t.equal(code, '<iframe src="//www.dailymotion.com/embed/video/x20qnej?autoPlay=1&start=66" width="400" height="200" frameborder="0" allowfullscreen></iframe>')
})

test('get vimeo thumbnail', function (t) {
  t.plan(3)
  embed.image('https://vimeo.com/19339941', function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.src, '//i.vimeocdn.com/video/122513613_640.jpg', 'embed.image returns an object with a src')
    t.equal(thumbnail.html, '<img src="//i.vimeocdn.com/video/122513613_640.jpg"/>', 'and an html tag')
  })
})

test('get vimeo thumbnail with options', function (t) {
  t.plan(2)
  embed.image('https://vimeo.com/19339941', {image: 'thumbnail_small'}, function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.html, '<img src="//i.vimeocdn.com/video/122513613_100x75.jpg"/>', 'correctly applys options thumbnail')
  })
})

test('get default vimeo thumbnail with invalid options', function (t) {
  t.plan(2)
  embed.image('https://vimeo.com/19339941', {image: 'what-rubbish'}, function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.html, '<img src="//i.vimeocdn.com/video/122513613_640.jpg"/>', 'correctly applys options thumbnail')
  })
})

test('get youtube thumbnail (prove backwards compatibility)', function (t) {
  t.plan(1)
  var embedImage = embed.image('https://youtu.be/ZeLnjXTNq6Q', {image: 'maxresdefault'})
  t.equal(embedImage, '<img src="//img.youtube.com/vi/ZeLnjXTNq6Q/maxresdefault.jpg"/>', 'retains synchronous behaviour and returns html image tag')
})

test('get dailymotion thumbnail', function (t) {
  t.plan(3)
  embed.image('https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport', function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.src, 'http://s1.dmcdn.net/IgPVQ/x480-ktj.jpg', 'embed.image returns an object with a src')
    t.equal(thumbnail.html, '<img src="http://s1.dmcdn.net/IgPVQ/x480-ktj.jpg"/>', 'and an html tag')
  })
})

test('get dailymotion thumbnail with options', function (t) {
  t.plan(2)
  embed.image('https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport', { image: 'thumbnail_720_url' }, function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.html, '<img src="http://s1.dmcdn.net/IgPVQ/x720-d_h.jpg"/>', 'correctly applys options thumbnail')
  })
})

test('get dailymotion thumbnail (dai.ly)', function (t) {
  t.plan(3)
  embed.image('http://dai.ly/x20qnej', function (err, thumbnail) {
    t.ifError(err, 'no errors')
    t.equal(thumbnail.src, 'http://s1.dmcdn.net/IgPVQ/x480-ktj.jpg', 'embed.image returns an object with a src')
    t.equal(thumbnail.html, '<img src="http://s1.dmcdn.net/IgPVQ/x480-ktj.jpg"/>', 'and an html tag')
  })
})

test('returns undefined for unrecognised embed URL', function (t) {
  t.plan(1)
  var res = embed.image('https://myvideoservice.com')
  t.equal(res, undefined, 'correct value')
  t.end()
})

test('returns undefined for unrecognised embed URL with callback', function (t) {
  t.plan(2)
  embed.image('https://myvideoservice.com', function (err, res) {
    t.ifError(err, 'no errors')
    t.equal(res, undefined, 'correct value')
    t.end()
  })
})

test('get vimeo source', function (t) {
  t.plan(3)
  var url = 'http://vimeo.com/19339941'
  var code = embed.videoSource(url)

  t.equal(code.id, '19339941')
  t.equal(code.source, 'vimeo')
  t.equal(code.url, url)
})

test('get vimeo source from channel', function (t) {
  t.plan(3)
  var url = 'https://vimeo.com/channels/staffpicks/185045662'
  var code = embed.videoSource(url)

  t.equal(code.id, '185045662')
  t.equal(code.source, 'vimeo')
  t.equal(code.url, url)
})

test('get vimeo source from group', function (t) {
  t.plan(3)
  var url = 'https://vimeo.com/groups/1minute/videos/261712339'
  var code = embed.videoSource(url)

  t.equal(code.id, '261712339')
  t.equal(code.source, 'vimeo')
  t.equal(code.url, url)
})

test('get vimeo source with trailing slash', function (t) {
  t.plan(3)
  var url = 'https://vimeo.com/groups/1minute/videos/261712339/'
  var code = embed.videoSource(url)

  t.equal(code.id, '261712339')
  t.equal(code.source, 'vimeo')
  t.equal(code.url, url)
})

test('get youtube.com source', function (t) {
  t.plan(3)
  var url = 'https://www.youtube.com/watch?v=twE64AuqE9A'
  var code = embed.videoSource(url)

  t.equal(code.id, 'twE64AuqE9A')
  t.equal(code.source, 'youtube')
  t.equal(code.url, url)
})

test('get youtu.be source', function (t) {
  t.plan(3)
  var url = 'http://youtu.be/9XeNNqeHVDw#aid=P-Do3JLm4A0'
  var code = embed.videoSource(url)

  t.equal(code.id, '9XeNNqeHVDw')
  t.equal(code.source, 'youtube')
  t.equal(code.url, url)
})

test('get dailymotion.co, source', function (t) {
  t.plan(3)
  var url = 'https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport'
  var code = embed.videoSource(url)

  t.equal(code.id, 'x20qnej')
  t.equal(code.source, 'dailymotion')
  t.equal(code.url, url)
})

test('get dai.ly source', function (t) {
  t.plan(3)
  var url = 'http://dai.ly/x20qnej'
  var code = embed.videoSource(url)

  t.equal(code.id, 'x20qnej')
  t.equal(code.source, 'dailymotion')
  t.equal(code.url, url)
})
