import SubmittableItem from 'operis/mixins/submittable-item';

var Operis{{ model.singular }}Controller = Ember.ObjectController.extend( SubmittableItem, {});

export default Operis{{ model.singular }}Controller;