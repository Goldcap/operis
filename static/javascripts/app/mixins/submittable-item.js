var SubmittableItem = Em.Mixin.create ({
  
    actions: {
        submit: function( item ) {
            //If we have a promise, the controller will receive a standard object
            //So let's look up the Model Instance
            if (! item instanceof DS.Model) {
              item = this.get('store').all(this.get('model.type')).findBy('id',item.id.toString());
            }
            if (item.get('isValid')) {
               item.save();
            }
          }
      }
    
});

export default SubmittableItem;