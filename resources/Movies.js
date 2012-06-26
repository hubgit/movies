var Movies = Backbone.Collection.extend({ model: Movie });

var MoviesView = Backbone.View.extend({
    el: $("#movies"),

    initialize: function() {
        this.collection.each(this.append, this);
    },

    append: function(movie) {
        var view = new MovieView({ model: movie });
        this.$el.append(view.render().el);
    }
});