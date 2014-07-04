import Person from 'operis/models/person';

var PeopleRoute = Ember.Route.extend({
  queryParams: {
    page: {
      //refreshModel: true
    }
  },
  model: function( params ) {
      return this.store.find('person', params);
    }
});

export default PeopleRoute;