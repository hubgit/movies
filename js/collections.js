var Collections = {
    Movies:  Backbone.Collection.extend({
        model: Models.Movie,
        
        sync: function(method, collection, options) {
            options.url = options.url || this.service.listURL(options.type);
            this.service.get(options.url, options).done(options.success);
        },

        parse: function(data) {
            this.links = data.links;
            return data.movies;
        }
    }),

    Links: Backbone.Collection.extend({})
};