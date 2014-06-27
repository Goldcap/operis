import PaginatableArray from 'operis/mixins/paginatable_array';

var PeopleController = Ember.ArrayController.extend( PaginatableArray, {});

export default PeopleController;  