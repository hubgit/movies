var Movie = Backbone.Model.extend({});

var MovieView = Backbone.View.extend({
    template: $("[data-template='movie']").html(),

    attributes: {
    	"class": "movie",
    	"vocab": "http://schema.org/",
    	"typeof": "Movie"
    },

    initialize: function() {
      this.model.bind("change", this.render, this);
    },

    render: function() {
        this.$el.html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    }
});