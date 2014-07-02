var PaginatableArray = Em.Mixin.create ({
  
    current_page: 1,
    current_results: [],
    num_pages: 1,
    lastPage: 1,
    rpp: 5,
    
    paginate: function() {                                           
        this.get('store').find(this.get('model.type'),{page:this.get("current_page")});
    }.observes("current_page"),
    
    paginatedContent: function() {
        
        this.set('current_results',[]);
        var scope = this;
        this.get('store.paged_result').forEach(function(item) {
            //Since we're using promises, we might not have our objects yet
            //Let's be careful to make sure we return __something__
            var ds_item = scope.findBy('id',item.id.toString());
            if (ds_item) {
                scope.get('current_results').push(item);
                //scope.get('current_results').push(ds_item);    
            } else {                 
                scope.get('current_results').push(item);
            }
        });
        
        return this.get('current_results');
    
    }.property('store.paged_result'),

    pagination: function () {
        if (this.get('content.isLoaded')) {
          var store = this.get('store');
          var modelType = this.get('model.type');
          var metadata = store.typeMapFor(modelType).metadata;
          this.set('num_pages',metadata.num_pages);
          this.set('current_page',metadata.current_page);
          this.set('rpp',metadata.rpp);
          return metadata;
        }      
    }.observes('content.isLoaded')
    
});

export default PaginatableArray;