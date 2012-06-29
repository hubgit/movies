var Templates = {};

Templates.load = function(templates) {
    return $.when.apply(this, templates.map(this.fetch));
};

Templates.fetch = function(template) {
    return $.ajax({
        url: "templates/" + encodeURIComponent(template) + ".html",
        dataType: "text",
    }).done(function(data) {
        Templates[template] = Handlebars.compile(data);
    });
};