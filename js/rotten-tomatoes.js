var RottenTomatoes = function(options) {
    this.base = "http://api.rottentomatoes.com/api/public/v1.0/";

    this.defaults = $.extend({
        page_limit: 25,
        page: 1,
        country: "uk"
    }, options);

    this.get = function(url, params, callback) {
        params = $.extend({}, this.defaults, params);
        $.getJSON(url + "?callback=?", params, callback);
    };

    this.list = function(type, callback) {
        this.get(this.base + "lists/movies/" + type + ".json", {}, callback);
    };
};