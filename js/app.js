/*jshint browser: true, newcap: true, nomen: false, plusplus: false, undef: true, white: false */
/*global Collections, Models, Templates, Views, RottenTomatoes, TMDB, jQuery, Handlebars, $ */

$(function() {
	var headerView, moviesView, paginationView;

	var movies = new Collections.Movies();
	var links = new Collections.Links();

	/** API keys **/

	var tomatoes = new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" });
	var tmdb = new TMDB({ api_key: "6afa2885030d27b856cfe12039ffa908" });

	/** Augmentors **/

	var augmentors = {
		"rt": function augmentTomatoes(movie) {
			tomatoes.get(movie.get("links").self, {}, function(data) {
				movie.set(data);
				movie.augmented.rt = true;
			}, true);
		},
		"tmdb": function augmentTMDB(movie) {
			var ids = movie.get("alternate_ids");
			if(!ids || !ids.imdb) return;

			// fetch full data for individual movie
			tmdb.movie("tt" + ids.imdb, function(data) {
				movie.set({ production_countries: data.production_countries });
				movie.augmented.tmdb = true;
			});
		}
	};

	var augment = function(movie) {
		if (!movie.augmented) movie.augmented = {};

		// augment each item with extra information
		$.each(augmentors, function(index, augmentor) {
			if(!movie.augmented[index]) augmentor(movie);
		});
	};

	/** Fetch the list of movies and update the collection **/

	var handleResponse = function(data) {
		movies.add(data.movies);
		links.reset(data.links);
		movies.each(augment);
	};

	var fetchPage = function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(event.currentTarget).addClass("loading").html("Loading more&hellip;");
		tomatoes.get(event.currentTarget.href, {}, handleResponse);
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
		movies.reset();
		links.reset();

		// fetch the list of items and display them
		tomatoes.list(getTypeFromLocation(), handleResponse);
	};

	var loadTemplate = function() {
		var template = $(this);
		Templates[template.data("template")] = Handlebars.compile(template.html());
	};

	$("[data-template]").each(loadTemplate);

	/** Render views **/

	var renderViews = function() {
		headerView = new Views.Header();

		moviesView = new Views.Movies({
			id: "movies",
			className: "wrapper",
			collection: movies
		});

		var events = {
			"click a": fetchPage,
			"inview a[rel=next]": fetchPage
		};

		paginationView = new Views.Pagination({
			id: "pagination",
			className: "wrapper pagination",
			collection: links
		});

		paginationView.delegateEvents(events);
	};


	renderViews();
	refresh();

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", refresh);
});
