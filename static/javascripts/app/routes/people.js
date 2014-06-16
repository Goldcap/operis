import Person from 'operis/models/person';

var PeopleRoute = Ember.Route.extend({
  model: function() {
      return this.store.find('person');
    }
});

export default PeopleRoute;
