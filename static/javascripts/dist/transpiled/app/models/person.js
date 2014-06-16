define("operis/models/person", 
  ["operis/models/user","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var User = __dependency1__["default"];

    var Person = DS.Model.extend({
      first_name: DS.attr('string'),
      last_name: DS.attr('string'),
      user: DS.belongsTo('user')
    });

    __exports__["default"] = Person;
  });