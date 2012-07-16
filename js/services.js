/*global $ */

var Services = {};

var Service = function() {};

Service.prototype.get = function(url, options) {
	options = options || {};

    var method = options.queue ? $.ajaxQueue : $.ajax;

    return method({
        url: url,
        data: $.extend({}, this.defaults, options.data),
        dataType: this.dataType,
        cache: true
    });
};

var RottenTomatoes = function(options) {
    this.base = "http://api.rottentomatoes.com/api/public/v1.0/";
    this.dataType = "jsonp";

    this.defaults = $.extend({
        page_limit: 12,
        page: 1,
        country: "uk"
    }, options);

    this.listURL = function(type) {
        return this.base + "lists/movies/" + type + ".json";
    };
};

RottenTomatoes.prototype = new Service();

var TMDB = function(options) {
    this.base = "http://api.themoviedb.org/3/";
    this.dataType = "json";

    this.defaults = $.extend({}, options);

    this.itemURL = function(id) {
        return this.base + "movie/" + encodeURIComponent(id);
    };
};

TMDB.prototype = new Service();
