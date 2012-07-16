/*global Backbone, Services, $, window */

var Collections = {}, Views = {}, Templates = {};

Collections.Movies = Backbone.Collection.extend({
    sync: function(method, collection, options) {
        var request;

        if(options.url) {
            request = Services.RottenTomatoes.get(options.url, { queue: false });
        }
        else {
            request = Services.RottenTomatoes.get(Services.RottenTomatoes.listURL(options.type));
        }

        request.done(options.success);
    },

    parse: function(data) {
        this.links = data.links;
        return data.movies;
    }
});

Collections.Links = Backbone.Collection.extend({});

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
        this.$el.html(Templates.Movie(this.model.toJSON()));
        return this;
    }
});

Views.Movies = Backbone.View.extend({
    initialize: function() {
        this.$el.appendTo("body");
        this.collection.on("reset", this.reset, this);
        this.collection.on("add", this.add, this);
    },

    events: {
        "click a": "openNewWindow"
    },

    reset: function() {
        this.$el.empty();
        this.collection.each(this.add, this);
    },

    add: function(movie) {
        var view = new Views.Movie({ model: movie });
        this.$el.append(view.render().el);
    },

    openNewWindow: function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.open(event.currentTarget.href);
    }
});

Views.Pagination = Backbone.View.extend({
    initialize: function() {
        this.$el.appendTo("body");
        this.collection.on("reset", this.reset, this);
    },

    reset: function() {
        this.$el.empty();
        this.collection.each(this.add, this);
    },

    add: function(links) {
        var url = links.get("next");
        if (!url) return;

        $("<a/>", { href: url, html: "More &darr;", rel: "next" }).appendTo(this.$el);
    }
});

Views.Header = Backbone.View.extend({
    tagName: "header",

    initialize: function() {
        this.$el.appendTo("body");
        this.render();
    },

    render: function() {
        var nav = $("<nav/>").addClass("wrapper");

        var fragments = {
            "in_theaters": "In Theatres",
            "opening": "Opening This Week"
        };

        $.each(fragments, function(fragment, text) {
            $("<a/>", { href: "#" + fragment, text: text }).appendTo(nav);
        });

        this.$el.append(nav);
    }
});