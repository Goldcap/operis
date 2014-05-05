App = Ember.Application.create();

App.ApplicationAdapter = DS.DjangoRESTAdapter.extend({
    namespace: 'api'
});

App.Person = DS.Model.extend({
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  user: DS.belongsTo('user'),
});

App.User = DS.Model.extend({
    username: DS.attr('string'),
    aliases: DS.hasMany('person', { async: true})
});

App.PersonsRoute = Ember.Route.extend({
  model: function() {
      return this.store.find('person');
    }
});

App.PersonController = Ember.ObjectController.extend({
  actions: {
      
      kiss: function() {
        alert("Mwa! We love " + this.get('content.first_name') + "!");
      },
      
      updatePerson: function(model) {
          model.save();
      }
  }
});

App.Router.map(function() {
  this.resource('name');
  this.resource('detail', { path: ':item' });
  this.route("persons", { path : "/person" });
  this.route("person", { path : "/person/:person_id" });
  this.route("user", { path : "/user/:user_id" });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return [{'color':'red'}, {'color':'yellow'}, {'color':'blue'}];
  }
});
