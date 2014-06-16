var IndexRoute = Ember.Route.extend({
  model: function() {
    return [{'color':'red'}, {'color':'yellow'}, {'color':'blue'}];
  }
});

export default IndexRoute;
