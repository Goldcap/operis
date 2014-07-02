var PersonController = Ember.ObjectController.extend({
  actions: {
      kiss: function() {
        alert("Mwa! We love " + this.get('content.first_name') + "!");
      },
      updatePerson: function( item ) {
          if (item instanceof DS.Model) {
            item.save();
          //If we have a promise, the controller will receive a standard object
          //So let's look up the Model Instance
          } else {
            console.log(this.get('model'));
            //item = this.get('store').all(this.get('model.type')).findBy('id',item.id.toString());
            //item.save();
          }
      }
  }
});

export default PersonController;