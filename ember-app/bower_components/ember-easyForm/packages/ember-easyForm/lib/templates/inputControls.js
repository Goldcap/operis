Ember.EasyForm.Config.registerTemplate('easyForm/inputControls', Ember.Handlebars.compile('{{input-field propertyBinding="view.property" inputOptionsBinding="view.inputOptionsValues"}}{{#if view.showError}}{{error-field propertyBinding="view.property"}}{{/if}}{{#if view.hint}}{{hint-field propertyBinding="view.property" textBinding="view.hint"}}{{/if}}'));