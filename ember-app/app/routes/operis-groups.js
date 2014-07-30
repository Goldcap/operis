import Ember from 'ember';
import Group from 'ember-app/models/group';

var OperisGroupsRoute = Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  model: function( params ) {
      return this.store.find('group', params);
    }
});

export default OperisGroupsRoute;