var Router = Ember.Router.extend();

Router.map(function() {
    this.resource('name');    
    this.resource('detail', { path: ':item' });
    this.resource('people', function() { 
        this.route('index');
    });
    this.route("person", { path : "/person/:person_id" });
});

export default Router;