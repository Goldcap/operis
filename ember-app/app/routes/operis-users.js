import Ember from 'ember';
import User from 'ember-app/models/user';

var OperisUsersRoute = Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  model: function( params ) {
      return this.store.find('user', params);
    }
});

export default OperisUsersRoute;