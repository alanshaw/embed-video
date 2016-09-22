var URL = require('url')
var request = require('request')

var validVimeoOpts = ['thumbnail_small', 'thumbnail_medium', 'thumbnail_large']
var validYouTubeOpts = ['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault']

function embed (url, opts) {
  var id

  url = URL.parse(url, true)

  id = detectYoutube(url)
  if (id) return embed.youtube(id, opts)

  id = detectVimeo(url)
  if (id) return embed.vimeo(id, opts)
}

embed.image = function (url, opts, cb) {
  var id

  url = URL.parse(url, true)

  id = detectYoutube(url)
  if (id) return embed.youtube.image(id, opts, cb)

  id = detectVimeo(url)
  if (id) return embed.vimeo.image(id, opts, cb)
}

function detectVimeo (url) {
  return (url.hostname == "vimeo.com") ? url.pathname.split("/")[1] : null
}

function detectYoutube (url) {
  if (url.hostname.indexOf("youtube.com") > -1) {
    return url.query.v
  }

  if (url.hostname == "youtu.be") {
    return url.pathname.split("/")[1]
  }

  return null
}

embed.vimeo = function (id, opts) {
  // TODO: use opts to set iframe attrs.
  var queryString = ''
  if (opts && opts.hasOwnProperty('query')){
    queryString = "?" + serializeQuery(opts.query)
  }
  return '<iframe src="//player.vimeo.com/video/' + id + queryString + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
}

embed.youtube = function (id, opts) {
  // TODO: use opts to set iframe attrs.
  var queryString = ''
  if (opts && opts.hasOwnProperty('query')){
    queryString = "?" + serializeQuery(opts.query)
  }
  return '<iframe src="//www.youtube.com/embed/' + id + queryString + '" frameborder="0" allowfullscreen></iframe>'
}

embed.youtube.image = function (id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  opts = opts || {}

  opts.image = validYouTubeOpts.indexOf(opts.image) > 0 ? opts.image : 'default'

  var src = '//img.youtube.com/vi/' + id + '/' + opts.image + '.jpg'

  var result = {
    src: src,
    html: '<img src="' + src + '"/>'
  }

  if (!cb) return result.html

  setTimeout(function () { cb(null, result) }, 1)
}

embed.vimeo.image = function (id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  if (!cb) throw new Error('must pass embed.vimeo.image a callback')

  opts = opts || {}

  opts.image = validVimeoOpts.indexOf(opts.image) >= 0 ? opts.image : 'thumbnail_large'

  request.get({
    url: 'http://vimeo.com/api/v2/video/' + id + '.json',
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)
    if (res.statusCode !== 200) return cb(new Error('unexpected response from vimeo'))
    if (!body || !body[0] || !body[0][opts.image]) return cb(new Error('no image found for vimeo.com/' + id))

    var src = body[0][opts.image].split(':')[1]

    var result = {
      src: src,
      html: '<img src="' + src + '"/>'
    }

    cb(null, result)
  })
}

function serializeQuery (query) {
  var queryString = []
  for(var p in query){
    if (query.hasOwnProperty(p)) {
      queryString.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
    }
  }
  return queryString.join("&")
}

module.exports = embed
