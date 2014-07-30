import OperisPerson from 'ember-app/models/operis-person';

var Person = OperisPerson.extend({
    validations: {
        /*
        first_name: {
          presence: { message: 'This value is required.' },
          length: { minimum: 3, maximum: 25, messages: { tooShort: 'Value should be more than 3 characters', tooLong: 'Value should be less than 5 characters' } }
        },
        */
        last_name: {
          presence: { message: 'This value is required.' },
          length: { minimum: 3, maximum: 25, messages: { tooShort: 'Value should be more than 3 characters', tooLong: 'Value should be less than 5 characters' } }
        }
      }
});

export default Person;
