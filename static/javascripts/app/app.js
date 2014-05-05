import Resolver from 'ember/resolver';

var App = Ember.Application.extend({
    modulePrefix: 'example',
    Resolver: Resolver['default']
});

export default App;
