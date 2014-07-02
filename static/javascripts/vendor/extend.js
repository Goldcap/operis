// JavaScript Document
Ember.EasyForm.Input.reopen({
  
  errorsChanged: function() {
    this.set('hasFocusedOut', true);
    this.showValidationError();
  },
  
  didInsertElement: function() {
    this.addObserver("formForModel.errors."+this.get('property')+".@each", this, "errorsChanged");
  }
   
});