var Templates = {};

var TemplateLoader = function() {
	this.load = function(templates) {
	    return $.when.apply(this, templates.map(fetch));
	};

	var fetch = function(template) {
		var request = $.ajax({
	        url: "templates/" + encodeURIComponent(template) + ".html",
	        dataType: "text"
	    });

	    return request.done(function(data) {
	        Templates[template] = Handlebars.compile(data);
	    });
	};
};
