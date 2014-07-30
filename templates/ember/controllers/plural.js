import Ember from 'ember';
import PaginatableArray from '{{ember_app_name}}/mixins/paginatable-array';

var Operis{{ model.plural }}Controller = Ember.ArrayController.extend( PaginatableArray, {});

export default  Operis{{ model.plural }}Controller;  