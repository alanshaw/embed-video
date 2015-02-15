/*jslint node: true, forin: true, white: true, newcap: true*/
/*jslint browser:true */
/*
 * embed
 * authors:
 * Alan Shaw,
 * Takeshi Iwana
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
    'use strict'
    var embed,
        version = '1.1.0',
        parsers = {
            youtube: {
                parse: function(url, callback) {
                    if (url.host.indexOf("youtube.com") > -1) {
                        url = url.query.v || url.query.replace(/v=/i, '');
                    }

                    if (url.host == "youtu.be") {
                        url = url.path.split("/")[1];
                    }
                    return callback(url, '<iframe src="https://www.youtube.com/embed/{{eid}}" frameborder="0" allowfullscreen class="{{class}}" id="{{id}}" width="{{width}}" height="{{height}}"></iframe>')
                }
            },
            vimeo: {
                parse: function(url, callback) {
                    url = (url.host == "vimeo.com") ? url.path.split("/")[1] : null;
                    return callback(url, '<iframe src="https://player.vimeo.com/video/{{eid}}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="{{class}}" id="{{id}}" width="{{width}}" height="{{height}}"></iframe>')
                }
            }
        },
        hasModule = (typeof module !== 'undefined' && module.exports);

    /*
        Helpers
     */
    // parseUri 1.2.2
    // (c) Steven Levithan <stevenlevithan.com>
    // http://blog.stevenlevithan.com/archives/parseuri
    // MIT License
    function Url(str, strict) {
        Url.options.strictMode = strict ? false : true;

        var o = Url.options,
            m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            uri = {},
            i = 14;

        while (i--) {
            uri[o.key[i]] = m[i] || "";
        }

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
            if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    };

    Url.options = {
        strictMode: false,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };

    //http://blakeembrey.com/articles/2014/01/wrapping-javascript-functions/
    var __slice = Array.prototype.slice;
    var wrap = function(fn, wrap) {
        return function() {
            return wrap.apply(this, [fn].concat(__slice.call(arguments)));
        };
    };

    /*
        Constructor
     */
    function Embed(arg, opt) {
        this.arg = arg;
        this.url = Url(arg, true);
        var options = {};
        //setup options
        options.class = opt ? (opt.class || '') : '';
        options.id = opt ? (opt.id || '') : '';
        options.width = opt ? (opt.width || '100%') : '100%';
        options.height = opt ? (opt.height || '100%') : '100%';

        this.opt = options;
        //begin adding parsers to Embed
        for (var parser in parsers) {
            if (parsers.hasOwnProperty(parser)) {
                var self = this;
                //create a wrapper
                self[parser] = wrap(parsers[parser], function(fn) {
                    return fn.parse(this.url, function(id, iframe) {
                        var script = iframe;
                        //http://stackoverflow.com/a/15502875/1251031
                        //match every '{{ }}' and return the inner content
                        iframe.match(/{{\s*[\w\.]+\s*}}/g)
                            .map(function(x) {
                                //if we are at {{eid}}
                                if (x.match(/eid/)) {
                                    //id is and object?
                                    if (typeof id === 'object' && id !== null) {
                                        //replace {{eid}} with the id
                                        script = script.replace(new RegExp(x.toString(), "g"), id.source);
                                        //id is string?
                                    } else if (typeof id === 'string' && id !== null) {
                                        script = script.replace(new RegExp(x.toString(), "g"), id);
                                        //id is null?
                                    } else if (id === null) {
                                        //then replace with the url's source
                                        script = script.replace(new RegExp(x.toString(), "g"), self.url.source);
                                    }
                                    //{{width}} {{height}} etc...
                                } else {
                                    //replace with values if they exist
                                    script = script.replace(new RegExp(x.toString(), "g"), self.opt[x.substring(2, x.length - 2)] || "");
                                }
                            });

                        return script;
                    });
                });
            }
        }
    }

    Embed.prototype.id = function() {
        //same concept as the above in Embed constructor
        //except return the id.
        for (var parser in parsers) {
            if (parsers.hasOwnProperty(parser)) {
                return parsers[parser].parse(this.url, function(id, iframe) {
                    if (typeof id === 'object' && id !== null) {
                        return id.path.split("/")[1];
                    } else if (typeof id === 'string' && id !== null) {
                        return id;
                    }
                });
            }
        }
    };

    /**
     * Main function
     */
    embed = function(arg, opt) {
        return new Embed(arg, opt)
    };


    /************************************
          Exposing embed
      ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = embed;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `embed` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this.embed = embed;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return embed;
        });
    }
}).call(this);
