import Person from 'example/models/person';

var PeopleRoute = Ember.Route.extend({
    model: function() {
        return Person.find();
    }
});

export default PeopleRoute;
