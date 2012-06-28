var Views = {};

Views.Movie = Backbone.View.extend({
    tagName: "article",

    attributes: {
    	"vocab": "http://schema.org/",
    	"typeof": "Movie"
    },

    initialize: function() {
      this.model.on("change", this.render, this);
    },

    render: function() {
        this.$el.html(Mustache.render(Templates.Movie, this.model.toJSON()));
        return this;
    }
});

Views.Movies = Backbone.View.extend({
    initialize: function() {
        //this.$el.appendTo("body");
        this.collection.on("add remove reset", this.render, this);
    },

    events: {
        "click a": "openNewWindow"
    },

    render: function() {
        this.$el.empty();
        this.collection.each(this.appendItemView, this);
    },

    appendItemView: function(movie) {
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
    render: function() {
        this.$el.empty();
        if (this.links.next) $("<a/>", { href: this.links.next, html: "More &darr;" }).appendTo(this.$el);
    },
});