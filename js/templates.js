var Templates = {};

var TemplateLoader = function(templatesList) {
	this.load = function(templates) {
	    return $.when.apply(this, templates.map(fetch));
	};

	var fetch = function(template) {
		var request = $.ajax({
	        url: "templates/" + encodeURIComponent(template) + ".html",
	        dataType: "text"
	    });

	    return request.done(function(data) {
	        templatesList[template] = Handlebars.compile(data);
	    });
	};
};
