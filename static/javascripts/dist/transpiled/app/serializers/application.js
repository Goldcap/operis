define("operis/serializers/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    //var AppSerializer = DS.DjangoRESTSerializer.extend({ 
    var AppSerializer = DS.RESTSerializer.extend({
         
    });

    /*
    App.Store = DS.Store.extend({
    adapter: 'App.CustomAdapter'
    });
    */
     
    __exports__["default"] = AppSerializer;
  });