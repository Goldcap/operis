define("operis/controllers/person", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var PersonController = Ember.ObjectController.extend({
      actions: {
          kiss: function() {
            alert("Mwa! We love " + this.get('content.first_name') + "!");
          },
          updatePerson: function(model) {
              model.save();
          }
      }
    });

    __exports__["default"] = PersonController;
  });