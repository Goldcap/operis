import Ember from 'ember';

var Router = Ember.Router.extend({
  location: EmberAppENV.locationType
});

Router.map(function() {
    this.resource('name');    
    this.resource('detail', { path: ':item' });
    this.resource('people', { path : "/people" }, function() {
        this.route('index');                             
    });
    this.route("person", { path : "/person/:person_id" });
});

export default Router;
