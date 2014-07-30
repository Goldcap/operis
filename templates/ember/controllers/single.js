import Ember from 'ember';
import SubmittableItem from '{{ember_app_name}}/mixins/submittable-item';

var Operis{{ model.singular }}Controller = Ember.ObjectController.extend( SubmittableItem, {});

export default Operis{{ model.singular }}Controller;