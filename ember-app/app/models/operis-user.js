import Ember from 'ember';
import DS from "ember-data";

var OperisUser = DS.Model.extend(Ember.Validations.Mixin,{
  password: DS.attr('string'),
  last_login: DS.attr('date'),
  is_superuser: DS.attr('boolean'),
  username: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  email: DS.attr('string'),
  is_staff: DS.attr('boolean'),
  is_active: DS.attr('boolean'),
  date_joined: DS.attr('date')
});
export default OperisUser;