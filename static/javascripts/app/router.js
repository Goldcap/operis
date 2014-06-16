var Router = Ember.Router.extend();

Router.map(function() {
    this.resource('name');    
    this.resource('detail', { path: ':item' });
    this.route('people', { path: '/people' });
    this.route("person", { path : "/person/:person_id" });
});

export default Router;