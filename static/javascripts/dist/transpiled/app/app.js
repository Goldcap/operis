define("operis/app", 
  ["ember/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
     
    //http://emberjs.com/guides/understanding-ember/debugging/
    var App = Ember.Application.extend({
        //LOG_TRANSITIONS: true,
        //LOG_TRANSITIONS_INTERNAL: true,
        modulePrefix: 'operis',
        Resolver: Resolver['default'],
        rootElement: '#ember-app'
    });

    Ember.Handlebars.registerHelper('debug', function(the_string){
      alert(the_string);
      // or simply
      //console.log(the_string);
    });

    __exports__["default"] = App;
  });