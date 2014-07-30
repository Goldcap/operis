import Ember from 'ember';
import Person from 'ember-app/models/person';

var OperisPeopleRoute = Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  model: function( params ) {
      return this.store.find('person', params);
    }
});

export default OperisPeopleRoute;