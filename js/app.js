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

	// augment each item with extra information
	var augment = function(movie) {
		if (movie.get("augmented")) return;

		// fetch full data for individual movies
		tomatoes.get(movie.get("links").self, {}, function(data) {
			if (data) {
				movie.set(data);
				movie.set("augmented", true);
			}
		});
	};

	paginationView.delegateEvents({
		"click a": function fetchURL(event) {
			event.preventDefault();
			event.stopPropagation();
			tomatoes.get(event.currentTarget.href, {}, handleResponse);
		}
	});

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

	Templates.load(["Movie"]).done(refresh);

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", refresh);
});
