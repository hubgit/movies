var Models = {};

Models.Movie = Backbone.Model.extend({
	initialize: function() {
		this.augmented = {};

		var movie = this;
		$.each(augmentors, function(index, augmentor) {
			augmentor(movie);
		});
	}
});