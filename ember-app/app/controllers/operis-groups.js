import Ember from 'ember';
import PaginatableArray from 'ember-app/mixins/paginatable-array';

var OperisGroupsController = Ember.ArrayController.extend( PaginatableArray, {});

export default  OperisGroupsController;  