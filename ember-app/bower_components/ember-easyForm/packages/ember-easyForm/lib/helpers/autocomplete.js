Ember.Handlebars.helpers['ember-input'] = Ember.Handlebars.helpers['autocomplete'];

Ember.Handlebars.registerHelper('autocomplete', function(property, options) {
  if (arguments.length === 1) {
    return Ember.Handlebars.helpers['ember-input'].call(this, arguments[0]);
  }

  options = Ember.EasyForm.processOptions(property, options);
  options.hash.isBlock = !!(options.fn);
  return Ember.Handlebars.helpers.view.call(this, Ember.EasyForm.Autocomplete, options);
});
