import Person from 'operis/models/person';

var PeoplePageRoute = Ember.Route.extend({
    model: function(params) {
        return Ember.Object.create({id: params.page_id});
    },
    setupController: function(controller, model) {
        //this.controllerFor('people').set('selectedPage', model.get('id'));
    }
});

export default PeoplePageRoute;