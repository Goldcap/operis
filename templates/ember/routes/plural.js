import {{ model.singular }} from 'operis/models/{{ model.singular_converted }}';

var Operis{{ model.plural }}Route = Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  model: function( params ) {
      return this.store.find('{{ model.singular_converted }}', params);
    }
});

export default Operis{{ model.plural }}Route;