var Models = {};

Models.Movie = Backbone.Model.extend({});
Models.Movies = Backbone.Collection.extend({ model: Models.Movie });

Models.Link = Backbone.Model.extend({});
Models.Links = Backbone.Collection.extend({ model: Models.Link });