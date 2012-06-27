var Movie = Backbone.Model.extend({});

var MovieView = Backbone.View.extend({
    tagName: "article",

    attributes: {
    	"vocab": "http://schema.org/",
    	"typeof": "Movie"
    },

    initialize: function() {
      this.model.bind("change", this.render, this);
    },

    render: function() {
        this.$el.html(Mustache.render(Templates.Movie, this.model.toJSON()));
        return this;
    }
});