var Views = {};

Views.Movie = Backbone.View.extend({
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

Views.Movies = Backbone.View.extend({
    /*
    initialize: function() {
        this.$el.appendTo("body");
    },
    */

    events: {
        "click a": "openNewWindow"
    },

    render: function() {
        this.$el.empty();
        this.collection.each(this.append, this);
    },

    append: function(movie) {
        var view = new Views.Movie({ model: movie });
        this.$el.append(view.render().el);
    },

    openNewWindow: function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.open(event.currentTarget.href);
    },
});

Views.Pagination = Backbone.View.extend({
    render: function(links) {
        this.$el.empty();
        if (links.next) $("<a/>", { href: links.next, html: "More &darr;" }).appendTo(this.$el);
    },
});