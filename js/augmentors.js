var today = new Date();
var oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

var augmentors = {
	rt: function augmentTomatoes(movie) {
		var releaseDate;

		var request = Services.RottenTomatoes.get(movie.get("links").self, { queue: true });

		request.done(function(data) {
			releaseDate = new Date(data.release_dates.theater);
			if (releaseDate < oneWeekAgo) data.old = true;

			movie.set(data);
			movie.augmented.rt = true;
		});
	},
	
	tmdb: function augmentTMDB(movie) {
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
