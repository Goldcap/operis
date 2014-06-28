var PaginatableArray = Em.Mixin.create ({
  
    current_page: 1,
    num_pages: 1,
    lastPage: 1,
    rpp: 5,
    
    paginate: function() {                                           
        this.get('store').find(this.get('model.type'),{page:this.get("current_page")});
    }.observes("current_page"),
    
    paginatedContent: function() {

        var selectedPage = this.get('current_page') || 1;
        var upperBound = (selectedPage * this.get('rpp'));
        var lowerBound = (selectedPage * this.get('rpp')) - this.get('rpp');
        var models = this.get('content');
        return this.get('store.paged_result');
    
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