var Templates = {};

$(function() {
	var tomatoes = new RottenTomatoes({ apikey: "bsmgb5axsjekh4jbwqyt38ak" });

	$("#movies").on("click", "a", function openNewWindow(event) {
		event.preventDefault();
		event.stopPropagation();
		window.open(this.href);
	});

	var augment = function(movie) {
		// fetch full data for individual movies
		tomatoes.get(movie.get("links").self, {}, function(data) {
			if (data) movie.set(data);
		});
	};

	var init = function() {
		// empty the view
		$("#movies").empty();

		// get the selected type of listing from the location hash
		var type = location.hash.replace("#", "") || "in_theaters";

		// set the active item in the nav bar
		$("nav a").removeClass("active").filter("[href='#" + type + "']").addClass("active");

		// fetch the list of items and display them
		tomatoes.list(type, function(data) {
			var collection = new Movies(data.movies);
			var view = new MoviesView({ collection: collection });

			// augment each item with extra information
			collection.each(augment);
		});

		// TODO: pagination
	};

	$.ajax({
		url: "resources/Movie.html",
		dataType: "text",
	}).then(function(data) {
		Templates.Movie = data;
		init();
	});

	// listen for changes to the selected type of listing
	$(window).bind("hashchange", init);
});
