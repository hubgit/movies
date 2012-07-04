var RottenTomatoes = function(options) {
    this.base = "http://api.rottentomatoes.com/api/public/v1.0/";

    this.defaults = $.extend({
        page_limit: 12,
        page: 1,
        country: "uk"
    }, options);

    this.get = function(url, params, callback, queue) {
        params = $.extend({}, this.defaults, params);
        url += url.indexOf("?") === -1 ? "?" : "&";

        var method = queue ? $.ajaxQueue : $.ajax;

        method({
            url: url + "callback=?",
            data: params,
            dataType: "json",
            success: callback,
        });
    };

    this.list = function(type, callback) {
        this.get(this.base + "lists/movies/" + type + ".json", {}, callback);
    };
};