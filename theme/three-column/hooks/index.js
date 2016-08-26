/**
 * Created by Aamod Pisat on 12-08-2016.
 */
var async = require('async');
var Hooks = {};
Hooks.serverExtends = function(app) {
    app.extends().use('/blog', function(req, res, next) {
        var data = req.contentstack.get('entry');
        if(data.url == '/blog'){
           var categories = data.categories;
            var jsonFunction = {};
            for (var i = 0; i < categories.length; i++) {
                (function(category){
                    jsonFunction[category.title] = function (callback) {
                        Blog.getPostsByCategory(category.title)
                            .spread(function (entries) {
                                callback(null, entries);
                            });
                    }
                })(categories[i]);
            }
            async.parallel(jsonFunction, function(err, results) {
                req.getViewContext().set('categoriesObj', results);
                next();
            });
        }else{
            next();
        }

    }, function(req, res, next) {
        Blog.getAuthors()
            .spread(function (authors){
                req.getViewContext().set('authors', authors);
                next();
            });
    }, function(req, res, next) {
        Blog.getCategories()
            .spread(function (categories){
                req.getViewContext().set('categories', categories);
                next();
            });
    } );
};
Hooks.templateExtends = function(engine) {
};
module.exports =  Hooks;