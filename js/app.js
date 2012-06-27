$(function() {
	/** Collections and Views **/

	var movies = new Models.Movies();

	var moviesView = new Views.Movies({
		//id: "movies",
		//className: "wrapper",
		el: "#movies",
		collection: movies,
	});

	var paginationView = new Views.Pagination({
		//id: "pagination"
		el: "#pagination",
	});

	/** API calls **/

	var tomatoes = new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" });

	var augment = function(movie) {
		// fetch full data for individual movies
		tomatoes.get(movie.get("links").self, {}, function(data) {
			if (data) movie.set(data);
		});
	};

	var fetchURL = function(event) {
		event.preventDefault();
		event.stopPropagation();
		tomatoes.get(event.currentTarget.href, {}, function(data) {
			movies.add(data.movies);
			render(data);
		});
	};

		paginationView.delegateEvents({
		"click a": fetchURL
	});

	var render = function(data) {
		moviesView.render();
		paginationView.render(data.links);
	};

	var init = function() {
		// get the selected type of listing from the location hash
		var type = location.hash.replace("#", "") || "in_theaters";

		// set the active item in the nav bar
		$("nav a").removeClass("active").filter("[href='#" + type + "']").addClass("active");

		// fetch the list of items and display them
		tomatoes.list(type, function(data) {
			movies.reset(data.movies);
			render(data);

			// augment each item with extra information
			movies.each(augment);
		});
	};

	Templates.load(["Movie"]).done(init);

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", init);
});
