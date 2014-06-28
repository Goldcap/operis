//var AppSerializer = DS.DjangoRESTSerializer.extend({ 
var AppSerializer = DS.RESTSerializer.extend({
    
    extractArray: function(store, primaryType, payload) {
        payload = this._super(store, primaryType, payload);
        this.set('store.paged_result',payload);
        return payload;
    }
         
});

/*
App.Store = DS.Store.extend({
adapter: 'App.CustomAdapter'
});
*/
 
export default AppSerializer;
