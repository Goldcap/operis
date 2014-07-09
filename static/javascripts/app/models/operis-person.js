var OperisPerson = DS.Model.extend(Ember.Validations.Mixin,{
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  company: DS.attr('string'),
  address: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  telephone: DS.attr('string')
});
export default OperisPerson;