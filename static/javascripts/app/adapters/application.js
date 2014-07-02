var AppAdapter = DS.RESTAdapter.extend({
    namespace: 'api',
    
    createRecord: function(store, type, record) {
        var data = {};
        var serializer = store.serializerFor(type.typeKey);

        serializer.serializeIntoHash(data, type, record, { includeId: true });

        return this.ajax(this.buildURL(type.typeKey), "POST", { data: data[type.typeKey] });
      },

    updateRecord: function(store, type, record) {
        var data = {};
        var serializer = store.serializerFor(type.typeKey);

        serializer.serializeIntoHash(data, type, record);

        var id = Em.get(record, 'id');
        return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: data[type.typeKey] });
      },
    
});
//var AppAdapter = DS.DjangoRESTAdapter.extend({namespace: 'api'});

export default AppAdapter;
