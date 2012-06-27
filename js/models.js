var Models = {};

Models.Movie = Backbone.Model.extend({});

Models.Movies = Backbone.Collection.extend({ model: Models.Movie });