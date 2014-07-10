var PaginatableArray = Em.Mixin.create ({
  
    queryParams: ['page'],
    page: 1,
    current_results: [],
    num_pages: 1,
    lastPage: 1,
    rpp: 5,
    
    paginatedContent: function() {
        
        this.set('current_results',[]);
        var scope = this;
        this.get('store.paged_result').forEach(function(item) {
            //Since we're using promises, we might not have our objects yet
            //Let's be careful to make sure we return __something__
            var ds_item = scope.findBy('id',item.id.toString());
            if (ds_item) {
                scope.get('current_results').push(ds_item);    
            } else {                 
                scope.get('current_results').push(item);
            }
        });
        
        return this.get('current_results');
    
    }.property('store.paged_result'),

    pagination: function () {
        if (this.get('content.isLoaded')) {
          var metadata = this.get('store').typeMapFor(this.get('model.type')).metadata;
          //this.set('page',metadata.current_page);
          this.set('num_pages',metadata.num_pages);
          this.set('rpp',metadata.rpp);
          return metadata;
        }      
    }.observes('content.isLoaded')
    
});

export default PaginatableArray;