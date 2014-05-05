var Person = Ember.Object.extend();

Person.reopenClass({
    people: [],
    find: function() {
        var first = Person.create({name: 'toran'});
        var last = Person.create({name: 'matt'});
        this.people.pushObject(first);
        this.people.pushObject(last);
        return this.people;
    }
});

export default Person;
