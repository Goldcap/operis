define("operis/adapters/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var AppAdapter = DS.RESTAdapter.extend({
        namespace: 'api'
    });
    //var AppAdapter = DS.DjangoRESTAdapter.extend({namespace: 'api'});

    __exports__["default"] = AppAdapter;
  });