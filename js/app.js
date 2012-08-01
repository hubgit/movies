/*jshint browser: true, newcap: true, nomen: false, plusplus: false, undef: true, white: false */
/*global Collections, Templates, Views, Services, RottenTomatoes, TMDB, jQuery, $ */

var Services = {
	RottenTomatoes: new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" }),
	TMDB: new TMDB({ api_key: "6afa2885030d27b856cfe12039ffa908" })
};

$(function() {
	/** API keys **/

	/** Fetch the list of movies and update the collection **/

	var updateLinks = function(collection) {
		app.collections.links.reset(collection.links);
	};

	var fetchPage = function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(event.currentTarget).addClass("loading").html("Loading more&hellip;");
		
		app.collections.movies.fetch({ add: true, url: event.currentTarget.href, success: updateLinks });
	};

	var getTypeFromLocation = function() {
		// get the selected type of listing from the location hash
		var type = location.hash.replace("#", "") || "in_theaters";

		// set the active item in the nav bar
		$("nav a").removeClass("active").filter("[href='#" + type + "']").addClass("active");

		return type;
	};

	var refresh = function() {
		// reset the AJAX queue
		$.ajaxQueue.stop(true);

		// empty the collection (in case switching sections)
		app.collections.movies.reset();
		app.collections.links.reset();

		// fetch the list of items and display them
		//Services.RottenTomatoes.list(getTypeFromLocation(), handleResponse);
		app.collections.movies.fetch({ type: getTypeFromLocation(), success: updateLinks, cache: false });
	};

	var app = {};

	/** collections */

	app.collections = {
		movies: new Collections.Movies(),
		links: new Collections.Links()
	}

	app.collections.movies.service = Services.RottenTomatoes;

	/** views */

	app.views = {
		header: new Views.Header(),

		movies: new Views.Movies({
			id: "movies",
			collection: app.collections.movies
		}),

		pagination: new Views.Pagination({
			id: "pagination",
			className: "pagination",
			collection: app.collections.links
		})
	};

	var events = {
		"click a": fetchPage,
		"inview a[rel=next]": fetchPage
	};

	app.views.pagination.delegateEvents(events);

	refresh();

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", refresh);
});
