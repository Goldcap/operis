define("operis/routes/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var IndexRoute = Ember.Route.extend({
      model: function() {
        return [{'color':'red'}, {'color':'yellow'}, {'color':'blue'}];
      }
    });

    __exports__["default"] = IndexRoute;
  });