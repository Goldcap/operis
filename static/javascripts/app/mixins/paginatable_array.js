var PaginatableArray = Em.Mixin.create ({
  
    current_page: 1,
    num_pages: 1,
    lastPage: 1,
    rpp: 5,
    
    paginate: function() {                                           
        console.log("Current Page Set To: " + this.get("current_page"));
        this.get('store').find(this.get('model.type'),{page:this.get("current_page")});
    }.observes("current_page"),
    
    paginatedContent: function() {

        var selectedPage = this.get('current_page') || 1;
        var upperBound = (selectedPage * this.get('rpp'));
        var lowerBound = (selectedPage * this.get('rpp')) - this.get('rpp');
        var models = this.get('content');
        
        return models.slice(lowerBound, upperBound);
    
    }.property('current_page', 'content.@each'),

    pagination: function () {
        if (this.get('content.isLoaded')) {
          var store = this.get('store');
          var modelType = this.get('model.type');
          var metadata = store.typeMapFor(modelType).metadata;
          this.set('num_pages',metadata.num_pages);
          this.set('current_page',metadata.current_page);
          this.set('rpp',metadata.rpp);
          console.log(metadata);
          return metadata;
        }      
    }.observes('content.isLoaded')
    
});

export default PaginatableArray;