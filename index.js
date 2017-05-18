var URL = require('url');
var promise = require('promise-polyfill');
var { fetch } = require('fetch-ponyfill')({ Promise: promise });
var escape = require('lodash.escape');

var YOUTUBE = 'youtube';
var VIMEO = 'vimeo';
var DAILYMOTION = 'dailymotion';

var validVimeoOpts = [
  'thumbnail_small',
  'thumbnail_medium',
  'thumbnail_large'
];
var validYouTubeOpts = [
  'default',
  'mqdefault',
  'hqdefault',
  'sddefault',
  'maxresdefault'
];
var validDailyMotionOpts = [
  'thumbnail_60_url',
  'thumbnail_120_url',
  'thumbnail_180_url',
  'thumbnail_240_url',
  'thumbnail_360_url',
  'thumbnail_480_url',
  'thumbnail_720_url',
  'thumbnail_1080_url'
];

function embed (url, opts) {
  var id

  url = URL.parse(url, true)

  id = detectYoutube(url)
  if (id) return embed.youtube(id, opts)

  id = detectVimeo(url)
  if (id) return embed.vimeo(id, opts)

  id = detectDailymotion(url)
  if (id) return embed.dailymotion(id, opts)
}

embed.image = function (url, opts, cb) {
  var id

  url = URL.parse(url, true)

  id = detectYoutube(url)
  if (id) return embed.youtube.image(id, opts, cb)

  id = detectVimeo(url)
  if (id) return embed.vimeo.image(id, opts, cb)

  id = detectDailymotion(url)
  if (id) return embed.dailymotion.image(id, opts, cb)
}

embed.videoSource = function(url) {
  var id

  url = URL.parse(url, true)

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

function detectDailymotion(url) {
  if (url.hostname.indexOf("dailymotion.com") > -1) {
    return url.pathname.split("/")[2].split("_")[0]
  }

  if (url.hostname === "dai.ly") {
    return url.pathname.split("/")[1]
  }

  return null
}

embed.vimeo = function (id, opts) {
  opts = parseOptions(opts);

  if (opts && opts.hasOwnProperty('query')){
    queryString = "?" + serializeQuery(opts.query)
  }

  return '<iframe src="//player.vimeo.com/video/'
          + id + opts.query + '"' + opts.attr
          + ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
}

embed.youtube = function (id, opts) {
  opts = parseOptions(opts);

  return '<iframe src="//www.youtube.com/embed/'
          + id + opts.query + '"' + opts.attr
          + ' frameborder="0" allowfullscreen></iframe>'
}

embed.dailymotion = function(id, opts) {
  opts = parseOptions(opts);

  if (opts && opts.hasOwnProperty("query")) {
    queryString = "?" + serializeQuery(opts.query);
  }

  return '<iframe src="//www.dailymotion.com/embed/video/'
         + id + opts.query + '"' + opts.attr
         + ' frameborder="0" allowfullscreen></iframe>';
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

  fetch('http://vimeo.com/api/v2/video/' + id + '.json')
    .then(function (res) {
      if (res.status !== 200) return cb(new Error('unexpected response from vimeo'))

      return res.json();
    })
    .then(function (res) {
      var body = res;
      if (!body || !body[0] || !body[0][opts.image]) return cb(new Error('no image found for vimeo.com/' + id))
      var src = body[0][opts.image].split(':')[1]

      var result = {
        src: src,
        html: '<img src="' + src + '"/>'
      }

      cb(null, result)
    })
    .catch(function(err) {
      return cb(err)
    })
}

embed.dailymotion.image = function(id, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  if (!cb) throw new Error('must pass embed.dailymotion.image a callback')

  opts = opts || {}

  opts.image = validDailyMotionOpts.indexOf(opts.image) >= 0 ? opts.image : 'thumbnail_480_url'

  fetch('https://api.dailymotion.com/video/' + id + '?fields=' + opts.image)
    .then(function (res) {
      if (res.status !== 200) return cb(new Error('unexpected response from dailymotion'))

      return res.json();
    })
    .then(function(res) {
      var body = res;
      if (!body || !body[opts.image]) return cb(new Error('no image found for dailymotion.com/' + id))
      var src = body[opts.image]

      var result = {
        src: src,
        html: '<img src="' + src + '"/>'
      }

      cb(null, result)
    })
    .catch(function(err) {
      return cb(err)
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

function parseOptions (opts) {
  var queryString = '', attributes = ''
  if (opts && opts.hasOwnProperty('query')) {
    queryString = "?" + serializeQuery(opts.query)
  }

  if(opts && opts.hasOwnProperty('attr')) {
    var temp = []
    Object.keys(opts.attr).forEach(function(key) {
      temp.push(key + '="' + escape(opts.attr[key]) + '"')
    });
    attributes = ' ' + temp.join(' ')
  }
  return {query: queryString, attr: attributes}
}

module.exports = embed
