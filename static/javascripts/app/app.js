import Resolver from 'ember/resolver';
 
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

export default App;