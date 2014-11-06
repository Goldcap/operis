Ember.EasyForm.Autocomplete = Ember.EasyForm.BaseView.extend({
  init: function() {
    this._super();
    this.classNameBindings.push('showError:' + this.get('wrapperConfig.fieldErrorClass'));
    Ember.defineProperty(this, 'showError', Ember.computed.and('canShowValidationError', 'formForModel.errors.' + this.property + '.firstObject'));
    if (!this.isBlock) {
      this.set('templateName', this.get('wrapperConfig.autocompleteTemplate'));
    }
  },
  setupValidationDependencies: function() {
    var keys = this.get('formForModel._dependentValidationKeys'), key;
    if (keys) {
      for(key in keys) {
        if (keys[key].contains(this.property)) {
          this._keysForValidationDependencies.pushObject(key);
        }
      }
    }
  }.on('init'),
  _keysForValidationDependencies: Ember.A(),
  dependentValidationKeyCanTrigger: false,
  tagName: 'div',
  classNames: ['string'],
  classNameBindings: ['wrapperConfig.autocompleteClass'],
  didInsertElement: function() {
    var name = 'label-field-'+this.elementId,
        label = this.get(name);
    if (!label) { return; }
    this.set(name+'.for', this.get('input-field-'+this.elementId+'.elementId'));
    this.addObserver('formForModel.errors.'+this.get('property')+'.@each', this, "errorsChanged");
    this.addObserver('input-field-'+this.elementId+'.value', this, "fetchResults" );
  },
  concatenatedProperties: ['inputOptions', 'bindableInputOptions'],
  inputOptions: ['as', 'collection', 'optionValuePath', 'optionLabelPath', 'selection', 'value', 'multiple', 'name', 'listFormat', 'valueFormat', 'params' ],
  bindableInputOptions: ['placeholder', 'prompt', 'disabled'],
  defaultOptions: {
    name: function(){
      if (this.property) {
        return this.property;
      }
    }
  },
  inputOptionsValues: function() {
    var options = {}, i, key, keyBinding, value, inputOptions = this.inputOptions, bindableInputOptions = this.bindableInputOptions, defaultOptions = this.defaultOptions;
    for (i = 0; i < inputOptions.length; i++) {
      key = inputOptions[i];
      if (this[key]) {
        if (typeof(this[key]) === 'boolean') {
          this[key] = key;
        }

        options[key] = this[key];
      }
    }
    for (i = 0; i < bindableInputOptions.length; i++) {
      key = bindableInputOptions[i];
      keyBinding = key + 'Binding';
      if (this[key] || this[keyBinding]) {
        options[keyBinding] = 'view.' + key;
      }
    }

    for (key in defaultOptions) {
      if (!defaultOptions.hasOwnProperty(key)) { continue; }
      if (options[key]) { continue; }

      if (value = defaultOptions[key].apply(this)) {
        options[key] = value;
      }
    }

    return options;
  }.property(),
  focusOut: function() {
    this.set('hasFocusedOut', true);
    this.showValidationError();
  },
  showValidationError: function() {
    if (this.get('hasFocusedOut')) {
      if (Ember.isEmpty(this.get('formForModel.errors.' + this.property))) {
        this.set('canShowValidationError', false);
      } else {
        this.set('canShowValidationError', true);
      }
    }
  },
  input: function() {
    this._keysForValidationDependencies.forEach(function(key) {
     this.get('parentView.childViews').forEach(function(view) {
       if (view.property === key) {
         view.showValidationError();
       }
     }, this);
    }, this);
  },
  fetchResults: function() {
        var element = this.get('input-field-'+this.elementId);
        var st = element.get('value');
        if (! st) {
            this.set('searchResults',[]);
            return;    
        }
        
        var model = this.get('formForModel');
        var store = model.get('store');
        var params = this.get('inputOptionsValues.params').split(",");
        var listformat = this.get('inputOptionsValues.listFormat');
        var valueformat = this.get('inputOptionsValues.valueFormat');
        var adapter = store.adapterFor(model);
        var scope = this;
        
        adapter.ajax(adapter.buildURL(model.get('constructor.typeKey')), 'GET', {data: {"search":st}} ).then(function(payload) {
            
            var inflector = Ember.Inflector.inflector;
            var objects = payload[inflector.pluralize(model.get('constructor.typeKey'))];
            objects.forEach(function(item, index) {   
              var data = Array();
              params.forEach(function(param, pi){
                data.push(item[param]);
              });
              item['formatted'] = Ember.String.htmlSafe(vsprintf(listformat,data));
              item['business'] = vsprintf(valueformat,data);
            });
            scope.set('searchResults',objects);
        });
    },
    actions: {
        setValue: function(item) {
            var element = this.get('input-field-'+this.elementId);
            console.log(item['business']);
            element.set('value',item['business']);
                
        }   
    }
});
