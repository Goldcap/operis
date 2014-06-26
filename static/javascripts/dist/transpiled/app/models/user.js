define("operis/models/user", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var User = DS.Model.extend({
        username: DS.attr('string'),
        aliases: DS.hasMany('person', { async: true})
    });

    __exports__["default"] = User;
  });