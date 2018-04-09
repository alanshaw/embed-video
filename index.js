var URL = require('url')
var promise = require('promise-polyfill')
var fetch = require('fetch-ponyfill')({ Promise: promise }).fetch
var escape = require('lodash.escape')

var YOUTUBE = 'youtube'
var VIMEO = 'vimeo'
var DAILYMOTION = 'dailymotion'

var validVimeoOpts = [
  'thumbnail_small',
  'thumbnail_medium',
  'thumbnail_large'
]
var validYouTubeOpts = [
  'default',
  'mqdefault',
  'hqdefault',
  'sddefault',
  'maxresdefault'
]
var validDailyMotionOpts = [
  'thumbnail_60_url',
  'thumbnail_120_url',
  'thumbnail_180_url',
  'thumbnail_240_url',
  'thumbnail_360_url',
  'thumbnail_480_url',
  'thumbnail_720_url',
  'thumbnail_1080_url'
]

var VIMEO_MATCH_RE = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)/

function embed (url, opts) {
  var res = embed.info(url)
  return res && embed[res.source] && embed[res.source](res.id, opts)
}

embed.info = function (url) {
  url = URL.parse(url, true)

  var id

  id = detectYoutube(url)
  if (id) {
    return {
      id: id,
      source: YOUTUBE,
      url: url.href
    }
  }

  id = detectVimeo(url)
  if (id) {
    return {
      id: id,
      source: VIMEO,
      url: url.href
    }
  }

  id = detectDailymotion(url)
  if (id) {
    return {
      id: id,
      source: DAILYMOTION,
      url: url.href
    }
  }
}

// For compat with <=2.0.1
embed.videoSource = embed.info

embed.image = function (url, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  opts = opts || {}

  var res = embed.info(url)
  if (!res && cb) return setTimeout(function () { cb() })
  return res && embed[res.source].image(res.id, opts, cb)
}

function detectVimeo (url) {
  var match
  return (url.hostname === 'vimeo.com' && (match = VIMEO_MATCH_RE.exec(url.pathname))) ? match[1] : null
}

function detectYoutube (url) {
  if (url.hostname.indexOf('youtube.com') > -1) {
    return url.query.v
  }

  if (url.hostname === 'youtu.be') {
    return url.pathname.split('/')[1]
  }

  return null
}

function detectDailymotion (url) {
  if (url.hostname.indexOf('dailymotion.com') > -1) {
    return url.pathname.split('/')[2].split('_')[0]
  }

  if (url.hostname === 'dai.ly') {
    return url.pathname.split('/')[1]
  }

  return null
}

embed.vimeo = function (id, opts) {
  opts = parseOptions(opts)
  return '<iframe src="//player.vimeo.com/video/' + id + opts.query + '"' + opts.attr + ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
}

embed.youtube = function (id, opts) {
  opts = parseOptions(opts)
  return '<iframe src="//www.youtube.com/embed/' + id + opts.query + '"' + opts.attr + ' frameborder="0" allowfullscreen></iframe>'
}

embed.dailymotion = function (id, opts) {
  opts = parseOptions(opts)
  return '<iframe src="//www.dailymotion.com/embed/video/' + id + opts.query + '"' + opts.attr + ' frameborder="0" allowfullscreen></iframe>'
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

  setTimeout(function () { cb(null, result) })
}

embed.vimeo.image = function (id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  if (!cb) throw new Error('must pass embed.vimeo.image a callback')

  opts = opts || {}

  opts.image = validVimeoOpts.indexOf(opts.image) >= 0 ? opts.image : 'thumbnail_large'

  fetch('https://vimeo.com/api/v2/video/' + id + '.json')
    .then(function (res) {
      if (res.status !== 200) {
        throw new Error('unexpected response from vimeo')
      }

      return res.json()
    })
    .then(function (body) {
      if (!body || !body[0] || !body[0][opts.image]) {
        throw new Error('no image found for vimeo.com/' + id)
      }

      var src = body[0][opts.image].split(':')[1]

      var result = {
        src: src,
        html: '<img src="' + src + '"/>'
      }

      cb(null, result)
    })
    .catch(function (err) {
      cb(err)
    })
}

embed.dailymotion.image = function (id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  if (!cb) throw new Error('must pass embed.dailymotion.image a callback')

  opts = opts || {}

  opts.image = validDailyMotionOpts.indexOf(opts.image) >= 0 ? opts.image : 'thumbnail_480_url'

  fetch('https://api.dailymotion.com/video/' + id + '?fields=' + opts.image)
    .then(function (res) {
      if (res.status !== 200) {
        throw new Error('unexpected response from dailymotion')
      }

      return res.json()
    })
    .then(function (body) {
      if (!body || !body[opts.image]) {
        throw new Error('no image found for dailymotion.com/' + id)
      }

      var src = body[opts.image]

      var result = {
        src: src,
        html: '<img src="' + src + '"/>'
      }

      cb(null, result)
    })
    .catch(function (err) {
      cb(err)
    })
}

function serializeQuery (query) {
  return Object.keys(query).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
  }).join('&')
}

function parseOptions (opts) {
  var queryString = ''
  var attributes = ''

  if (opts && opts.hasOwnProperty('query')) {
    queryString = '?' + serializeQuery(opts.query)
  }

  if (opts && opts.hasOwnProperty('attr')) {
    attributes = ' ' + Object.keys(opts.attr).map(function (key) {
      return key + '="' + escape(opts.attr[key]) + '"'
    }).join(' ')
  }

  return { query: queryString, attr: attributes }
}

module.exports = embed
