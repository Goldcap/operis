import User from 'operis/models/user';

var Person = DS.Model.extend(Ember.Validations.Mixin,{
  validations: {
    first_name: {
      presence: true,
      length: { minimum: 3, maximum: 25, messages: { tooShort: 'Value should be more than 3 characters', tooLong: 'Value should be less than 5 characters' } }
    },
    last_name: {
      presence: true,
      length: { minimum: 3, maximum: 25, messages: { tooShort: 'Value should be more than 3 characters', tooLong: 'Value should be less than 5 characters' } }
    }
  },
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  user: DS.belongsTo('user')
});

export default Person;
