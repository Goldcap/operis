import PaginatableArray from 'operis/mixins/paginatable-array';

var Operis{{ model.plural }}Controller = Ember.ArrayController.extend( PaginatableArray, {});

export default  Operis{{ model.plural }}Controller;  