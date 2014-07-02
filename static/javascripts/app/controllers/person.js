var PersonController = Ember.ObjectController.extend({
  actions: {
      kiss: function() {
        alert("Mwa! We love " + this.get('content.first_name') + "!");
      },
      updatePerson: function(model) {
          if (model instanceof DS.Model) {
            model.save();
          //If we have a promise, the controller will receive a standard object
          //So let's look up the Model Instance
          } else {
            model = this.get('store').all('person').findBy('id',model.id.toString());
            model.save();
          }
      }
  }
});

export default PersonController;