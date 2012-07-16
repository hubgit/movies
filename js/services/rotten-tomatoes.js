var RottenTomatoes = function(options) {
    this.base = "http://api.rottentomatoes.com/api/public/v1.0/";

    this.defaults = $.extend({
        page_limit: 12,
        page: 1,
        country: "uk",
    }, options);

    this.get = function(url, params, queue) {
        var method = queue ? $.ajaxQueue : $.ajax;

        return method({
            url: url,
            data: $.extend({}, this.defaults, params),
            dataType: "jsonp",
            cache: true,
        });
    };

    this.list = function(type) {
        return this.get(this.base + "lists/movies/" + type + ".json");
    };
};