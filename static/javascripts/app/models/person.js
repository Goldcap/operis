import User from 'operis/models/user';

var Person = DS.Model.extend({
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  user: DS.belongsTo('user')
});

export default Person;
