import Ember from 'ember';
/* global vsprintf */

var Autocomplete = Ember.Component.extend({
    
    searchText: null,
   
    fetchResults: function() {
        var st = this.get("searchText");
        if (! st) {
            console.log("NO!");
            this.set('searchResults',[]);
            return;    
        }
        
        var parent = this.get('parent');
        var model = parent.get('model');
        var store = parent.get('store');
        
        var params = this.get('params').split(",");
        var format = this.get('format');
        
        //console.log(vsprintf(format, params));
        //console.log(params);
        
        var scope = this;
        store.find(model.get('constructor.typeKey'), {"search":st} ).then(function(response) {
            response.content.forEach(function(item) {   
              var data = [];
              params.forEach(function(param){
                data.push(item.get(param));
                //console.log(param);
              });
            
              item.set('display',Ember.String.htmlSafe(vsprintf(format,data)));
            });
            scope.set('searchResults',response.content);
        });
        
    }.observes('searchText')
    
});

export default Autocomplete;