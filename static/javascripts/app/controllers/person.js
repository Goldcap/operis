var PersonController = Ember.ObjectController.extend({
  actions: {
      
      kiss: function() {
        alert("Mwa! We love " + this.get('content.first_name') + "!");
      },
      
      updatePerson: function(model) {
          model.save();
      }
  }
});

export default PersonController;