/* global require, module */

// Import a couple of modules;
var mergeTrees  = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var compileSass = require('broccoli-sass');

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
    'foundation-sass': {
        'modernizr': true,
        'fastclick': true,
        'foundationJs': 'all'
    }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.
                                                   
app.import('bower_components/pikaday/pikaday.js');
app.import('bower_components/ember-easyForm/dist/ember-easyForm.min.js');
app.import('bower_components/ember-validations/dist/ember-validations.min.js');       
app.import('bower_components/jquery-csrf/jquery.csrf.js'); 
app.import('bower_components/sprintf/dist/sprintf.min.js'); 
app.import('bower_components/moment/moment.js');            

app.import("bower_components/components-font-awesome/css/font-awesome.css");
app.import("bower_components/components-font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
app.import("bower_components/components-font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
app.import("bower_components/components-font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
app.import("bower_components/components-font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
app.import("bower_components/components-font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });

var pikadayFiles = pickFiles('bower_components/pikaday', {
  srcDir: '/css',
  files: ['*'],
  destDir: '/assets'
});

// Merge the ember app and the custom css into a single tree for export
var appAndCustomDependencies = mergeTrees([app.toTree(),pikadayFiles], {
  overwrite: true
});

// EXPORT ALL THE THINGS!
module.exports = appAndCustomDependencies;

//module.exports = app.toTree();
