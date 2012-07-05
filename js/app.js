$(function() {
	var headerView, moviesView, paginationView;

	var movies = new Collections.Movies();
	var links = new Collections.Links();

	/** API calls **/

	var tomatoes = new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" });
	var tmdb = new TMDB({ api_key: "" });

	var augmentTomatoes = function(movie) {
		tomatoes.get(movie.get("links").self, {}, function(data) {
			if (data) {
				movie.set(data);
				movie.augmented.rt = true;
			}
		}, true);
	};

	var augmentTMDB = function(movie) {
		var ids = movie.get("alternate_ids");
		if(!ids || !ids.imdb) return;

		// fetch full data for individual movie
		tmdb.movie("tt" + ids.imdb, {}, function(data) {
			if (data) {
				movie.set({ production_countries: data.production_countries });
				movie.augmented.tmdb = true;
			}
		});
	};

	var augmentors = {
		"rt": augmentTomatoes,
		//"tmdb": augmentTMDB
	};

	// augment each item with extra information
	var augment = function(movie) {
		if (!movie.augmented) movie.augmented = {};

		$.each(augmentors, function(index, augmentor) {
			if(!movie.augmented[index]) augmentor(movie);
		});
	};

	var fetchPage = function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(event.currentTarget).addClass("loading").html("Loading more&hellip;");
		tomatoes.get(event.currentTarget.href, {}, handleResponse);
	};

	var handleResponse = function(data) {
		movies.add(data.movies);
		links.reset(data.links);
		movies.each(augment);
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

	var renderViews = function() {
		headerView = new Views.Header();

		moviesView = new Views.Movies({
			id: "movies",
			className: "wrapper",
			collection: movies
		});

		var events = {
			"click a": fetchPage,
			"inview a[rel=next]": fetchPage,
		};

		paginationView = new Views.Pagination({
			id: "pagination",
			className: "wrapper pagination",
			collection: links
		});

		paginationView.delegateEvents(events);
	};

	$("[data-template]").each(loadTemplate);

	renderViews();
	refresh();

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", refresh);
});
