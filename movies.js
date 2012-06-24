var movies = $("#movies");

var base = "http://api.rottentomatoes.com/api/public/v1.0/";

var defaults = {
    apikey: "bsmgb5axsjekh4jbwqyt38ak",
    page_limit: 20,
    page: 1,
    country: "uk"
};

var get = function(url, params, callback) {
    params = $.extend({}, defaults, params);
    $.getJSON(url + "?callback=?", params, callback);
};

var openNewWindow = function(event) {
    event.preventDefault();
    event.stopPropagation();
    window.open(event.target.href, "Rotten Tomatoes");
};

var init = function() {
    movies.empty();
    
    var hash = location.hash.replace("#", "") || "opening";
    
    get(base + "lists/movies/" + hash + ".json", {}, function showMovies(data) {
        var template = $("[data-template=movie]").html();
    
        data.movies.forEach(function getMovie(movie) {
            get(movie.links.self, {}, function showMovie(movie) {
                movies.append(Mustache.render(template, movie));
            });
        });
    });
};
    
movies.on("click", ".movie .title, .movie .link", openNewWindow);
    
$(window).bind("hashchange", init);
init();
