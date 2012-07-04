$(function() {
	var movies, moviesView, paginationView, headerView;

	/** API calls **/

	var tomatoes = new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" });
	//var tmdb = new TMDB({ api_key: "" });

	// augment each item with extra information
	var augment = function(movie) {
		if (!movie.augmented) movie.augmented = {};

		if (typeof tomatoes !== "undefined" && !movie.augmented.rt) {
			// fetch full data for individual movie
			tomatoes.get(movie.get("links").self, {}, function(data) {
				if (data) {
					movie.set(data);
					movie.augmented.rt = true;
				}
			}, true);
		}

		if (typeof tmdb !== "undefined" && !movie.augmented.tmdb) {
			var ids = movie.get("alternate_ids");

			if(ids && ids.imdb) {
				// fetch full data for individual movie
				tmdb.movie("tt" + ids.imdb, {}, function(data) {
					if (data) {
						movie.set({
							production_countries: data.production_countries,
						});
						movie.augmented.rt = true;
					}
				});
			}
		}
	};

	var fetchURL = function(event) {
		event.preventDefault();
		event.stopPropagation();
		tomatoes.get(event.currentTarget.href, {}, handleResponse);
	};

	var handleResponse = function(data) {
		movies.add(data.movies);

		paginationView.links = data.links;
		paginationView.render();

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

		// fetch the list of items and display them
		tomatoes.list(getTypeFromLocation(), handleResponse);
	};

	var init = function() {
		(new Views.Header()).render();

		movies = new Models.Movies();

		moviesView = new Views.Movies({
			id: "movies",
			className: "wrapper",
			//el: "#movies",
			collection: movies,
		});

		paginationView = new Views.Pagination({
			id: "pagination",
			className: "wrapper pagination",
			//el: "#pagination",
		});

		paginationView.delegateEvents({
			"click a": fetchURL,
			"inview a": fetchURL,
		});

		refresh();
	};

	(new TemplateLoader(Templates)).load(["Movie", "Header"]).done(init);

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", refresh);
});
