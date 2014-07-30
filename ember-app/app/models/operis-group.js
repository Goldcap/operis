import Ember from 'ember';
import DS from "ember-data";

var OperisGroup = DS.Model.extend(Ember.Validations.Mixin,{
  name: DS.attr('string')
});
export default OperisGroup;