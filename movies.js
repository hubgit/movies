var RottenTomatoes = {
    base: "http://api.rottentomatoes.com/api/public/v1.0/",

    defaults: {
        apikey: "bsmgb5axsjekh4jbwqyt38ak",
        page_limit: 10,
        page: 1,
        country: "uk"
    },

    get: function(url, params, callback) {
        params = $.extend({}, this.defaults, params);
        $.getJSON(url + "?callback=?", params, callback);
    },

    list: function(type, callback) {
        this.get(this.base + "lists/movies/" + type + ".json", {}, callback);
    }
};

var Movie = function(data) {
    this.data = data;
    moviesView.append(this);

    this.set = function(data) {
        this.data = data;
        moviesView.replace(this);
    };
};

var MovieCollection = function() {
    var items = [];

    this.fetch = function(type) {
        this.reset();

        RottenTomatoes.list(type, function(data) {
            data.movies.forEach(movies.push);
            moviesView.render();
            movies.augment();
        });
    };

    this.reset = function() {
        items = [];
    };

    this.push = function(data) {
        var movie = new Movie(data);
        items.push(movie);
    };

    this.augment = function() {
        items.forEach(this.details);
    };

    this.details = function(movie) {
        RottenTomatoes.get(movie.data.links.self, {}, function(data) {
            if (data) movie.set(data);
        });
    };
};

var MoviesView = function() {
    this.el = $("#movies");

    this.init = function() {
        $(document).on("click", ".movie a", openNewWindow);
        $(window).bind("hashchange", this.update, this);
        movies.fetch("opening");
    }

    this.update = function() {
        this.reset();
        movies.fetch(location.hash.replace("#", ""));
    };

    this.reset = function() {
        this.el.empty();
    };

    this.append = function(movie) {
        var view = new MovieView();
        view.render().appendTo(this.el);
    };

    this.replace = function(movie) {
        var view = new MovieView();
        movie.el = view.render().replaceAll(movie.el);
    };

    this.init();
};

var MovieView = function() {
    this.template = $("[data-template=movie]").html();

    this.render = function(movie) {
        this.el = $(Mustache.render(template, movie.data));
    };
};

var openNewWindow = function(event) {
    event.preventDefault();
    event.stopPropagation();
    window.open(this.href);
};

var movies = new MovieCollection;
var moviesView = new MoviesView;
