import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  //LOG_TRANSITIONS: true,
  //LOG_TRANSITIONS_INTERNAL: true,
  modulePrefix: 'ember-app', // TODO: loaded via config
  Resolver: Resolver,
  rootElement: '#ember-app'
});

loadInitializers(App, 'ember-app');

export default App;