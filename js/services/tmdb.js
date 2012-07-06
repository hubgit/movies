var TMDB = function(options) {
    this.base = "http://api.themoviedb.org/3/";

    this.defaults = $.extend({}, options);

    this.get = function(url, params, callback) {
        $.ajaxQueue({
            url: url,
            data: $.extend({}, this.defaults, params),
            dataType: "json",
            success: callback,
        });
    };

    this.movie = function(id, callback) {
        this.get(this.base + "movie/" + encodeURIComponent(id), {}, callback);
    };
};