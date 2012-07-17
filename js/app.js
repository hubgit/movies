/*jshint browser: true, newcap: true, nomen: false, plusplus: false, undef: true, white: false */
/*global Collections, Templates, Views, Services, RottenTomatoes, TMDB, jQuery, $ */

$(function() {
	var headerView, moviesView, paginationView;

	/** API keys **/

	var Services = {
		RottenTomatoes: new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" }),
		TMDB: new TMDB({ api_key: "6afa2885030d27b856cfe12039ffa908" })
	};

	var movies = new Collections.Movies();
	movies.service = Services.RottenTomatoes;

	var links = new Collections.Links();

	/** Augmentors **/

	var today = new Date(),
		oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

	var augmentors = {
		"rt": function augmentTomatoes(movie) {
			var releaseDate;

			var request = Services.RottenTomatoes.get(movie.get("links").self, { queue: true });

			request.done(function(data) {
				releaseDate = new Date(data.release_dates.theater);
				if (releaseDate < oneWeekAgo) data.old = true;

				movie.set(data);
				movie.augmented.rt = true;
			});
		},
		"tmdb": function augmentTMDB(movie) {
			var ids = movie.get("alternate_ids");
			if(!ids || !ids.imdb) return;

			// fetch full data for individual movie
			var url = Services.TMDB.itemURL("tt" + ids.imdb);
			var request = Services.TMDB.get(url, { queue: true });

			request.done(function(data) {
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

	var updateLinks = function(collection) {
		links.reset(collection.links);
		collection.each(augment);
	};

	var fetchPage = function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(event.currentTarget).addClass("loading").html("Loading more&hellip;");
		movies.fetch({ add: true, url: event.currentTarget.href, success: updateLinks });
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
		//Services.RottenTomatoes.list(getTypeFromLocation(), handleResponse);
		movies.fetch({ type: getTypeFromLocation(), success: updateLinks, cache: false });
	};

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
