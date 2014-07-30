import Ember from 'ember';
import PaginatableArray from 'ember-app/mixins/paginatable-array';

var OperisUsersController = Ember.ArrayController.extend( PaginatableArray, {});

export default  OperisUsersController;  