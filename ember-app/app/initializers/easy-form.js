import Ember from 'ember';

export default {
  name: 'easyForm',
  initialize: function( container, app) {

    Ember.EasyForm.Input.reopen({
      errorsChanged: function() {
        this.set('hasFocusedOut', true);
        this.showValidationError();
      },
      classNameBindings: ['wrapperConfig.inputClass', 'wrapperErrorClass'],
      didInsertElement: function() {
        this._super();
        this.addObserver('context.errors' + this.property + '.@each', this, 'errorsChanged');
      }
    });

    Ember.EasyForm.Error.reopen({
      errorText: function() {
        return this.get('errors.firstObject');
      }.property('errors.firstObject').cacheable(),
      updateParentView: function() {
        var parentView = this.get('parentView');
        if(this.get('errors.length') > 0) {
          parentView.set('wrapperErrorClass', 'has-error');
        }else{
          parentView.set('wrapperErrorClass', false);
        }
      }.observes('errors.firstObject')
    });

    Ember.EasyForm.Submit.reopen({
      disabled: function() {
        return this.get('formForModel.disableSubmit');
      }.property('formForModel.disableSubmit')
    });

    //-- Bootstrap 3 Class Names --------------------------------------------
    //-- https://github.com/dockyard/ember-easyForm/issues/47
    Ember.TextSupport.reopen({
      classNames: ['form-control']
    });

    var options = {};
    Ember.EasyForm.Config.registerWrapper('default', options);
  }
};