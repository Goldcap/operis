define("operis/serializers/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var AppSerializer = DS.DjangoRESTSerializer.extend();
    //var AppSerializer = DS.RESTSerializer.extend();

    __exports__["default"] = AppSerializer;
  });