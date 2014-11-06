(function() {
var originalRequire, originalRequireJs;

module('EasyForm config methods');

test('contains a default wrapper', function() {
  var wrapper = Ember.EasyForm.Config.getWrapper('default');
  ok(wrapper, 'The default wrapper could not be found');
  equal(wrapper.errorClass, 'error');
});

test('register custom wrappers', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {errorClass: 'my-error'});
  var wrapper = Ember.EasyForm.Config.getWrapper('my_wrapper');
  ok(wrapper, 'The custom wrapper could not be found');
  equal(wrapper.errorClass, 'my-error');
});

test('merge the default wrapper with the custom one', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {errorClass: 'my-error'});
  var wrapper = Ember.EasyForm.Config.getWrapper('my_wrapper');
  equal(wrapper.errorClass, 'my-error');
  equal(wrapper.hintClass, 'hint');
});

test('register custom input types', function() {
  Ember.EasyForm.Config.registerInputType('my_input', Ember.EasyForm.Select);
  Ember.EasyForm.Config.registerInputType('another_input', Ember.EasyForm.Label);

  var inputType = Ember.EasyForm.Config.getInputType('my_input');
  equal(inputType, Ember.EasyForm.Select);
  inputType = Ember.EasyForm.Config.getInputType('another_input');
  equal(inputType, Ember.EasyForm.Label);
});

})();

(function() {
var model, view, container, controller, valid, ErrorsObject,
  get = Ember.get,
  set = Ember.set;
var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;
ErrorsObject = Ember.Object.extend({
  unknownProperty: function(property) {
    this.set(property, Ember.makeArray());
    return this.get(property);
  }
});

module('error-field helpers', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    model = {
      firstName: 'Brian',
      lastName: 'Cardarella',
      errors: ErrorsObject.create()
    };
    controller = Ember.ObjectController.create();
    controller.set('content', model);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('error helper should bind to first error message in array', function() {
  view = Ember.View.create({
    template: templateFor('{{error-field firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('span.error').text(), '');
  Ember.run(function() {
    get(model, 'errors.firstName').pushObject("can't be blank");
  });
  equal(view.$().find('span.error').text(), "can't be blank");
  Ember.run(function() {
    get(model, 'errors.firstName').unshiftObject('is invalid');
  });
  equal(view.$().find('span.error').text(), 'is invalid');
  Ember.run(function() {
    get(model, 'errors.firstName').clear();
  });
  equal(view.$().find('span.error').text(), '');
});

test('uses the wrapper config', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {errorClass: 'my-error'});
  view = Ember.View.create({
    template: templateFor('{{#form-for controller wrapper="my_wrapper"}}{{error-field firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    model.errors.set('firstName', ["can't be blank"]);
  });
  ok(view.$().find('span.my-error').get(0), 'errorClass not defined');
});

test('uses the defined template name', function() {
  Ember.TEMPLATES['custom-error-template'] = templateFor('My custom error | {{view.errorText}}');
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {errorTemplate: 'custom-error-template'});

  view = Ember.View.create({
    template: templateFor('{{#form-for model wrapper="my_wrapper"}}{{error-field firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    model.errors.set('firstName', ["can't be blank"]);
  });
  equal(view.$().text(), "My custom error | can't be blank");
});


})();

(function() {
var model, view, container, controller, valid,
  get = Ember.get,
  set = Ember.set;

var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;
var validateFunction = function() {
  var promise = new Ember.Deferred();
  promise.resolve();
  return promise;
};

module('the form-for helper', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    model = {
      firstName: 'Brian',
      lastName: 'Cardarella',
      errors: Ember.Object.create(),
      validate: validateFunction
    };
    var Controller = Ember.ObjectController.extend({
      actions: {
        submit: function() {
          this.incrementProperty('count');
        },
        bigSubmit: function() {
          this.incrementProperty('count', 2);
        }
      }
    });
    controller = Controller.create();
    controller.set('content', model);
    controller.set('count', 0);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('renders a form element', function() {
  view = Ember.View.create({
    template: templateFor('{{#form-for controller}}{{/form-for}}'),
    controller: controller
  });
  append(view);
  ok(view.$().find('form').get(0));
});

test('uses the defined wrapper', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {formClass: 'my-form-class'});
  view = Ember.View.create({
    template: templateFor('{{#form-for controller wrapper="my_wrapper"}}{{/form-for}}'),
    controller: controller
  });
  append(view);
  equal(view.$().find('form').attr('class'), 'ember-view my-form-class');
});

test('submitting with invalid model does not call submit action on controller', function() {
  Ember.run(function() {
    set(model, 'isValid', false);
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for controller}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 0);
});

test('submitting with valid model calls submit action on controller', function() {
  Ember.run(function() {
    set(model, 'isValid', true);
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for controller}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 1);
});

test('submitting with valid controller calls submit action on controller', function() {
  controller.reopen({
    validate: function() {
      var promise = new Ember.Deferred();
      promise.resolve();
      return promise;
    }
  });
  Ember.run(function() {
    controller.set('isValid', true);
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for controller}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 1);
});

test('can override the action called by submit on the controller', function() {
  Ember.run(function() {
    set(model, 'isValid', true);
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for controller action="bigSubmit"}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 2);
});

test('submitting with model that does not have validate method', function() {
  var model = Ember.Object.create();
  Ember.run(function() {
    controller.set('content', model);
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for controller}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 1);
});

test('submitting with ember-data model without validations can call submit action on controller', function() {
  Ember.run(function() {
    set(model, 'isValid', false);
    model.validate = undefined;
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for controller}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 1);
});

test('uses the specified model as the basis for {{input}} property lookup', function() {
  view = Ember.View.create({
    template: templateFor('{{#form-for theModel}}{{input foo name="easy-input"}} <div id="asl">{{foo}}</div> {{input id="ember-input" value=foo}}{{/form-for}}'),
    container: container,
    controller: Ember.Controller.create({
      theModel: { foo: "LOL" },
      foo: "BORING"
    })
  });
  append(view);

  equal(view.$('input[name="easy-input"]').val(), "LOL", "easy-input uses form-for's model as its context for looking up its property");
  equal(view.$('#ember-input').val(), "BORING", "vanilla ember inputs are unaffected by form-for");
  equal(view.$('#asl').text(), "BORING", "form-for doesn't change context for plain ol bindings");
});

test('uses the specified models validation object', function() {
  model = {
    theModel: {
      validate: validateFunction
    },
    count: 0
  };
  controller.set('content', model);
  view = Ember.View.create({
    template: templateFor('{{#form-for theModel}}{{input foo}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);

  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 0);

  set(model, 'theModel.isValid', true);
  Ember.run(function() {
    view._childViews[0].trigger('submit');
  });
  equal(controller.get('count'), 1);
});

})();

(function() {
var model, view, container, controller, valid,
  get = Ember.get,
  set = Ember.set;

var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;

module('hint-field helpers', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    model =  { firstName: 'Brian' };
    controller = Ember.ObjectController.create();
    controller.set('content', model);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('renders a hint field with custom text', function() {
  view = Ember.View.create({
    template: templateFor('{{hint-field firstName text="Some text"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('span.hint').text(), 'Some text');
});

test('does not render a hint field without custom text', function() {
  view = Ember.View.create({
    template: templateFor('{{hint-field firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('span.hint').length, 0, 'The hint element should not have been created');
});


test('uses the wrapper config', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {hintClass: 'my-hint'});
  view = Ember.View.create({
    template: templateFor('{{#form-for controller wrapper="my_wrapper"}}{{hint-field firstName text="Some text"}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  ok(view.$().find('span.my-hint').get(0), 'hintClass not defined');
});

test('uses the defined template name', function() {
  Ember.TEMPLATES['custom-hint-template'] = templateFor('My custom hint | {{view.hintText}}');
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {hintTemplate: 'custom-hint-template'});

  view = Ember.View.create({
    template: templateFor('{{#form-for controller wrapper="my_wrapper"}}{{hint-field firstName text="My text"}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().text(), "My custom hint | My text");
});

})();

(function() {
var model, view, container, controller, valid, countries,
  get = Ember.get,
  set = Ember.set;

var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;

module('input-field helpers', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    countries = [{ id: 1, name: 'South Aftica' }, { id: 2, name: 'United States' }];

    model = {
      firstName: 'Brian',
      lastName: 'Cardarella',
      country: countries[1]
    };

    controller = Ember.ObjectController.create();
    controller.set('content', model);
    controller.set('optionsForCountry', countries);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('render text input and sets value propertly', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'text');
  equal(view.$().find('input').val(), 'Brian');
});

test('allows setting of input attributes', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field secret type="hidden"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'hidden');
});

test('auto sets input type to password if name includes password', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field passwordConfirmation}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'password');
});

test('auto sets input type to password if forced to password', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field token as="password"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'password');
});

test('auto sets input type to url if name includes url', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field url}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'url');
});

test('auto sets input type to url if forced to url', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field website as="url"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'url');
});

test('auto sets input type to color if name includes color', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field color}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'color');
});

test('auto sets input type to color if forced to color', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field hue as="color"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'color');
});

test('auto sets input type to tel if name includes tel', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field telephone}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'tel');
});

test('auto sets input type to tel if forced to tel', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field phoneNumber as="tel"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'tel');
});

test('auto sets input type to search if name includes search', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field search}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'search');
});

test('auto sets input type to search if forced to search', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field query as="search"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'search');
});

test('auto sets input type to email if name includes email', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field email}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'email');
});

test('auto sets input type to email if forced to email', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field receivedAt as="email"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'email');
});

test('auto sets input type to number if property meta attribute is a number', function() {
  model['metaForProperty'] = function(property) {
    var obj = { 'type': 'number' };
    if (property === 'age') {
      return obj;
    }
  };
  set(model,'age', 30);
  view = Ember.View.create({
    template: templateFor('{{input-field age}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'number');
});

test('auto sets input type to number if property is a number', function() {
  set(model,'age', 30);
  view = Ember.View.create({
    template: templateFor('{{input-field age}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'number');
});

test('auto sets input type to date if property meta attribute is a date', function() {
  model['metaForProperty'] = function(property) {
    var obj = { 'type': 'date' };
    if (property === 'birthday') {
      return obj;
    }
  };
  set(model,'birthday', new Date());
  view = Ember.View.create({
    template: templateFor('{{input-field birthday}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'date');
});

test('auto sets input type to checkbox if forced to checkbox', function() {
  set(model,'alive', true);
  view = Ember.View.create({
    template: templateFor('{{input-field alive as="checkbox"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'checkbox');
  equal(view.$().find('input').is(':checked'), true);
});

test('auto sets input type to checkbox if property meta attribute is a boolean', function() {
  model['metaForProperty'] = function(property) {
    var obj = { 'type': 'boolean' };
    if (property === 'old') {
      return obj;
    }
  };
  set(model,'old', false);
  view = Ember.View.create({
    template: templateFor('{{input-field old}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'checkbox');
});

test('auto sets input type to number if property is a number', function() {
  set(model,'age', 30);
  view = Ember.View.create({
    template: templateFor('{{input-field age}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'number');
});

test('does not fail if a controller content constructor does not respond to proto', function() {
  controller.set('content', []);
  view = Ember.View.create({
    template: templateFor('{{input-field name}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'text');
});

test('renders semantic form elements with text area', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field firstName as="text"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('textarea').val(), 'Brian');
});

test('uses the custom input type when defined', function() {
  Ember.EasyForm.Config.registerInputType('my_input', Ember.EasyForm.TextArea);
  Ember.EasyForm.Config.registerInputType('another_input', Ember.EasyForm.TextField);
  view = Ember.View.create({
    template: templateFor('{{input-field firstName as="my_input"}}{{input-field lastName as="another_input"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('textarea').val(), 'Brian');
  equal(view.$().find('input').val(), 'Cardarella');
});

test('generates a select input and options', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field country as="select" collection="optionsForCountry"}}'),
    container: container,
    controller: controller
  });

  append(view);
  equal(view.$().find('select').length, 1);
  equal(view.$().find('select option').length, 2);
});

test('generates a select input and options with prompt', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field country as="select" collection="optionsForCountry" prompt="Select Country"}}'),
    container: container,
    controller: controller
  });

  append(view);
  equal(view.$().find('select').length, 1);
  equal(view.$().find('select option').length, 3);
});

test('generates a select input with correct selection', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field country as="select" collection="optionsForCountry" selection="country" optionValuePath="content.id" optionLabelPath="content.name"}}'),
    container: container,
    controller: controller
  });

  append(view);
  ok(view.$().find('select option:selected').html().match(/United States/));
});

test('generates a select input with correct selection when no selection is specified', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field country as="select" collection="optionsForCountry" optionValuePath="content.id" optionLabelPath="content.name"}}'),
    container: container,
    controller: controller
  });

  append(view);
  ok(view.$().find('select option:selected').html().match(/United States/));
});

test('generates a select input correct value', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field country as="select" collection="optionsForCountry" value="country.id" optionValuePath="content.id" optionLabelPath="content.name"}}'),
    container: container,
    controller: controller
  });

  append(view);
  ok(view.$().find('select option:selected').html().match(/United States/));
});

test('auto sets input type to date', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field receivedAt as="date"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'date');
});

test('auto sets input type to time', function() {
  view = Ember.View.create({
    template: templateFor('{{input-field receivedAt as="time"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').attr('type'), 'time');
});

})();

(function() {
var model, Model, view, valid, container, controller, ErrorsObject, originalEmberWarn,
  set = Ember.set,
  get = Ember.get;

var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var originalLookup = Ember.lookup, lookup;
ErrorsObject = Ember.Object.extend({
  unknownProperty: function(property) {
    this.set(property, Ember.makeArray());
    return this.get(property);
  }
});

function prepare(){
  container = new Ember.Container();
  container.optionsForType('template', { instantiate: false });
  container.resolver = function(fullName) {
    var name = fullName.split(':')[1];
    return Ember.TEMPLATES[name];
  };
  model = {
    firstName: 'Brian',
    lastName: 'Cardarella'
  };
  controller = Ember.ObjectController.create({
    placeholder: 'A placeholder',
    label: 'A label',
    hint: 'A hint',
    prompt: 'A prompt'
  });
  controller.set('content', model);
}

function cleanup(){
  Ember.run(function() {
    view.destroy();
    view = null;
  });
  Ember.lookup = originalLookup;
}

module('input helpers', {
  setup: prepare,
  teardown: cleanup
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('renders semantic form elements', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('label').text(), 'First name');
  equal(view.$().find('input').val(), 'Brian');
  equal(view.$().find('input').attr('type'), 'text');
});

test('does not render error tag when context does not have errors object', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));
  Ember.run(function() {
    view._childViews[0].trigger('focusOut');
  });
  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));
});

test('renders error for invalid data', function() {
  model['errors'] = ErrorsObject.create();

  Ember.run(function() {
    get(model, 'errors.firstName').pushObject("can't be blank");
  });

  view = Ember.View.create({
    template: templateFor('{{input firstName}}'),
    container: container,
    controller: controller
  });
  append(view);

  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));

  Ember.run(function() {
    view._childViews[0].trigger('input');
  });
  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));

  Ember.run(function() {
    view._childViews[0].trigger('focusOut');
  });
  ok(view.$().find('div.fieldWithErrors').get(0));
  equal(view.$().find('span.error').text(), "can't be blank");

  Ember.run(function() {
    get(model, 'errors.firstName').clear();
  });
  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));

  Ember.run(function() {
    view._childViews[0].trigger('focusOut');
  });
  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));

  Ember.run(function() {
    get(model, 'errors.firstName').pushObject("can't be blank");
    view._childViews[0].trigger('input');
  });
  ok(!view.$().find('div.fieldWithErrors').get(0));
  ok(!view.$().find('span.error').get(0));

  Ember.run(function() {
    view._childViews[0].trigger('focusOut');
  });
  ok(view.$().find('div.fieldWithErrors').get(0));
  equal(view.$().find('span.error').text(), "can't be blank");
});

test('renders errors properly with dependent keys', function() {
  var passwordView, confirmationView;
  model['errors'] = ErrorsObject.create();
  model['_dependentValidationKeys'] = {
    passwordConfirmation: ['password']
  };

  Ember.run(function() {
    get(model,'errors.passwordConfirmation').pushObject("does not match password");
  });

  view = Ember.View.create({
    template: templateFor('{{input password}}{{input passwordConfirmation}}'),
    container: container,
    controller: controller
  });
  append(view);
  passwordView = view._childViews[0];
  confirmationView = view._childViews[1];

  ok(!confirmationView.$().hasClass('fieldWithErrors'));
  ok(!confirmationView.$().find('span.error').get(0));

  Ember.run(function() {
    passwordView.trigger('input');
  });
  ok(!confirmationView.$().hasClass('fieldWithErrors'));
  ok(!confirmationView.$().find('span.error').get(0));

  Ember.run(function() {
    passwordView.trigger('focusOut');
  });
  ok(!confirmationView.$().hasClass('fieldWithErrors'));
  ok(!confirmationView.$().find('span.error').get(0));

  Ember.run(function() {
    confirmationView.trigger('focusOut');
  });
  ok(confirmationView.$().hasClass('fieldWithErrors'));
  ok(confirmationView.$().find('span.error').get(0));

  Ember.run(function() {
    get(model, 'errors.passwordConfirmation').clear();
    confirmationView.trigger('focusOut');
  });
  ok(!confirmationView.$().hasClass('fieldWithErrors'));
  ok(!confirmationView.$().find('span.error').get(0));

  Ember.run(function() {
    get(model, 'errors.passwordConfirmation').pushObject("does not match password");
    passwordView.trigger('input');
  });
  ok(confirmationView.$().hasClass('fieldWithErrors'));
  ok(confirmationView.$().find('span.error').get(0));
});

test('allows label text to be set', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName label="Your First Name"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('label').text(), 'Your First Name');
});

test('allows hint text to be set', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName hint="My hint text"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('span.hint').text(), 'My hint text');
});

test('does not show hint span when there is no hint', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('span.hint').length, 0);
});

test('block form for input', function() {
  view = Ember.View.create({
    template: templateFor('{{#input firstName}}{{label-field firstName}}{{input-field firstName}}{{error-field firstName}}{{/input}}'),
    container: container,
    controller: controller
  });
  append(view);

  var input = view.$().find('input');
  var label = view.$().find('label');

  equal(label.text(), 'First name');
  equal(input.val(), 'Brian');
  equal(input.attr('type'), 'text');
  equal(label.prop('for'), input.prop('id'));
});

test('block form for input without label', function() {
  view = Ember.View.create({
    template: templateFor('{{#input firstName}}{{input-field firstName}}{{/input}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('input').val(), 'Brian');
  equal(view.$().find('input').attr('type'), 'text');
});

test('sets input attributes property', function() {
  view = Ember.View.create({
    template: templateFor('{{input receiveAt as="email" placeholder="Your email" disabled=true}}'),
    container: container,
    controller: controller
  });
  append(view);
  var input = view.$().find('input');
  equal(input.prop('type'), 'email');
  equal(input.prop('placeholder'), 'Your email');
  equal(input.prop('disabled'), true);
});

test('binds label to input field', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  var input = view.$().find('input');
  var label = view.$().find('label');
  equal(input.prop('id'), label.prop('for'));
});

test('uses the wrapper config', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {inputClass: 'my-input', errorClass: 'my-error', fieldErrorClass: 'my-fieldWithErrors'});
  model['errors'] = ErrorsObject.create();

  Ember.run(function() {
    get(model,'errors.firstName').pushObject("can't be blank");
  });
  view = Ember.View.create({
    template: templateFor('{{#form-for model wrapper="my_wrapper"}}{{input firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[0]._childViews[0].trigger('focusOut');
  });
  ok(view.$().find('div.my-input').get(0), 'inputClass not defined');
  ok(view.$().find('div.my-fieldWithErrors').get(0), 'fieldErrorClass not defined');
  ok(view.$().find('span.my-error').get(0), 'errorClass not defined');
});

test('uses the defined template name', function() {
  Ember.TEMPLATES['custom-input-template'] = templateFor('My custom template | {{label-field propertyBinding="view.property"}}');
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {inputTemplate: 'custom-input-template'});

  view = Ember.View.create({
    template: templateFor('{{#form-for model wrapper="my_wrapper"}}{{input firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().text(), 'My custom template | First name');
});

test('sets input attributes property as bindings', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName placeholderBinding="placeholder" labelBinding="label" hintBinding="hint"}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').prop('placeholder'), controller.get('placeholder'));
  equal(view.$().find('label').text(), controller.get('label'));
  equal(view.$().find('.hint').text(), controller.get('hint'));

  Ember.run(function() {
    controller.setProperties({
      placeholder: 'Write your first name',
      label: 'First name (not a last name)',
      hint: 'Usually different than your last name'
    });
  });

  equal(view.$().find('input').prop('placeholder'), controller.get('placeholder'));
  equal(view.$().find('label').text(), controller.get('label'));
  equal(view.$().find('.hint').text(), controller.get('hint'));
});

test('sets select prompt property as bindings', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName as="select" labelBinding="label" hintBinding="hint" promptBinding="prompt"}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('option').text(), controller.get('prompt'));
  equal(view.$().find('label').text(), controller.get('label'));
  equal(view.$().find('.hint').text(), controller.get('hint'));

  Ember.run(function() {
    controller.setProperties({
      prompt: 'Select an option',
      label: 'First name (not a last name)',
      hint: 'Usually different than your last name'
    });
  });

  equal(view.$().find('option').text(), controller.get('prompt'));
  equal(view.$().find('label').text(), controller.get('label'));
  equal(view.$().find('.hint').text(), controller.get('hint'));
});

test('defaults the name property', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').prop('name'), "firstName");
});

test('allows specifying the name property', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName name="some-other-name"}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').prop('name'), "some-other-name");
});

test('scopes property lookup to model declared in form-for', function(){
  controller.set('someOtherModel', Ember.Object.create({firstName: 'Robert'}));

  view = Ember.View.create({
    template: templateFor('{{#form-for someOtherModel}}{{input firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').val(), "Robert");
});

test('can specify a property outside of the model if a keyword is used as a prefix', function(){
  controller.set('someOtherModel', Ember.Object.create({firstName: 'Robert'}));

  view = Ember.View.create({
    template: templateFor('{{#form-for someOtherModel}}{{input controller.firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').val(), "Brian");
});

test('select collection can use controller scope if prefix', function() {
  controller.set('someOtherModel', Ember.Object.create({ city: 'Ocala' }));

  controller.set('cities', Ember.A("Boston Ocala Portland".w()));

  view = Ember.View.create({
    template: templateFor('{{#form-for someOtherModel}}{{input city as="select" collection="controller.cities"}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$('option').text(), "BostonOcalaPortland");
  equal(view.$('option:selected').text(), "Ocala");
});

test('sets input as="date" attributes properly', function() {
  view = Ember.View.create({
    template: templateFor('{{input receiveAt as="date"}}'),
    container: container,
    controller: controller
  });
  append(view);
  var input = view.$().find('input');
  equal(input.prop('type'), 'date');
});

module('{{input}} without property argument', {
  setup: prepare,
  teardown: cleanup
});

test('allows using the {{input}} helper', function() {
  view = Ember.View.create({
    template: templateFor('{{input name="first-name"}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').prop('name'), "first-name");
});

test('{{ember-input}} uses the original Ember {{input}} helper', function(){
  view = Ember.View.create({
    template: templateFor('{{ember-input name="first-name"}}'),
    container: container,
    controller: controller
  });
  append(view);

  equal(view.$().find('input').prop('name'), "first-name");
});

test('adds a class to the parent div for the property name', function() {
  view = Ember.View.create({
    template: templateFor('{{input firstName labelClass="blammo"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('div.input.firstName input').val(), 'Brian');
});

})();

(function() {
var model, view, container, controller, valid;
var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;

module('label-field helpers', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    model = {
      firstName: 'Brian',
    };
    controller = Ember.ObjectController.create();
    controller.set('content', model);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('renders a label field', function() {
  view = Ember.View.create({
    template: templateFor('{{label-field firstName}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('label').text(), 'First name');
});

test('renders a label field with custom text', function() {
  view = Ember.View.create({
    template: templateFor('{{label-field firstName text="Your first name"}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().find('label').text(), 'Your first name');
});

test('uses the wrapper config', function() {
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {labelClass: 'my-label'});
  view = Ember.View.create({
    template: templateFor('{{#form-for controller wrapper="my_wrapper"}}{{label-field firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  ok(view.$().find('label.my-label').get(0), 'labelClass not defined');
});

test('uses the defined template name', function() {
  Ember.TEMPLATES['custom-label-template'] = templateFor('My custom label | {{view.labelText}}');
  Ember.EasyForm.Config.registerWrapper('my_wrapper', {labelTemplate: 'custom-label-template'});

  view = Ember.View.create({
    template: templateFor('{{#form-for controller wrapper="my_wrapper"}}{{label-field firstName}}{{/form-for}}'),
    container: container,
    controller: controller
  });
  append(view);
  equal(view.$().text(), "My custom label | First name");
});


})();

(function() {
var model, view, container, controller, valid,
  set = Ember.set,
  get = Ember.get;

var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;

module('submit helpers', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    model = {
      firstName: 'Brian',
      lastName: 'Cardarella',
      validate: function() {
        return valid;
      },
    };
    var Controller = Ember.Controller.extend({
      actions: {
        submit: function() {
          this.incrementProperty('count');
        }
      }
    });
    controller = Controller.create();
    controller.set('count', 0);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('renders submit button', function() {
  view = Ember.View.create({
    template: templateFor('{{submit}}'),
    container: container,
    context: model
  });
  append(view);
  equal(view.$().find('input').prop('value'), 'Submit');
  equal(view.$().find('input').prop('type'), 'submit');
});

test('renders as button', function() {
  view = Ember.View.create({
    template: templateFor('{{submit as="button"}}'),
    container: container,
    context: model
  });
  append(view);
  equal(view.$().find('button').text(), 'Submit');
  equal(view.$().find('button').prop('type'), 'submit');
});

test('has custom value as button', function() {
  view = Ember.View.create({
    template: templateFor('{{submit "Create" as="button"}}'),
    container: container,
    context: model
  });
  append(view);
  equal(view.$().find('button').text(), 'Create');
});

test('submit as button disabled state is bound to models valid state', function() {
  Ember.run(function() {
    set(model,'isValid', false);
  });
  view = Ember.View.create({
    template: templateFor('{{submit as="button"}}'),
    container: container,
    context: model
  });
  append(view);
  equal(view.$().find('button').prop('disabled'), true);
  Ember.run(function() {
    set(model,'isValid', true);
  });
  equal(view.$().find('button').prop('disabled'), false);
});

test('custom value', function() {
  view = Ember.View.create({
    template: templateFor('{{submit "Create"}}'),
    container: container,
    context: model
  });
  append(view);
  equal(view.$().find('input').prop('value'), 'Create');
});

test('submit button disabled state is bound to models valid state', function() {
  Ember.run(function() {
    set(model,'isValid', false);
    model = Ember.Object.create(model);
  });
  view = Ember.View.create({
    template: templateFor('{{submit}}'),
    container: container,
    context: model
  });
  append(view);
  equal(view.$().find('input').prop('disabled'), true);
  Ember.run(function() {
    set(model,'isValid', true);
  });
  equal(view.$().find('input').prop('disabled'), false);
});

})();

(function() {
module('EasyForm utility methods', {

});

test('humanizes string', function() {
  equal(Ember.EasyForm.humanize('firstName'), 'First name');
});

test('mutation of options - only property', function() {
  equal(Ember.EasyForm.processOptions('firstName'), 'firstName');
});

test('mutation of options - property and options', function() {
  var options = {hash: {placeholder: 'First name'}};
  deepEqual(Ember.EasyForm.processOptions('firstName', options), {hash: {placeholder: 'First name', property: 'firstName'}});
});

test('mutation of options - property and translation options (e.g. placeholderTranslation, labelTranslation, etc) without Ember.I18n', function() {
  var options = {hash: {placeholderTranslation: 'users.first_name'}};
  deepEqual(Ember.EasyForm.processOptions('firstName', options), {hash: {placeholderTranslation: 'users.first_name', property: 'firstName'}});
});

test('mutation of options - property and translation options (e.g. placeholderTranslation, labelTranslation, etc) with Ember.I18n', function() {
  Ember.I18n = {
    t: function(key) {
      return Ember.EasyForm.humanize(key);
    }
  };
  var options = {hash: {placeholderTranslation: 'users.first_name'}};
  deepEqual(Ember.EasyForm.processOptions('firstName', options), {hash: {placeholder: 'Users.first name', property: 'firstName'}});
  
  delete Ember.I18n;
});
})();

