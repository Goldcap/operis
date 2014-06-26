var PeopleController = Ember.ArrayController.extend({
    
    showPagination: true,
    page: 1,
    lastPage: 1,
    
    showBeforeEllipsis: function() {
        if (this.get('visiblePages.firstObject') > 3) return true;
    }.property('visiblePages.[]'),
    
    showAfterEllipsis: function() {
        if  (Math.abs(this.get('lastPage') - this.get('visiblePages.lastObject')) > 2) return true;
    }.property('visiblePages.[]', 'lastPage'),

    getFinish: function( start, limit ) {
        return start + limit - 1;
    },
      
    pagination: function () {
        if (this.get('content.isLoaded')) {
          var store = this.get('store');
          var modelType = this.get('model.type');
          var metadata = store.typeMapFor(modelType).metadata;
          console.log(metadata);
          //this.set('count',metadata.pagination.count);
          return metadata;
        }      
    }.observes('content.isLoaded'),
    
    visiblePages: function() {
        var pages = this.get('pages');
        var page  = this.get('page');
    
        // limit the number of pages to five, or the number of pages
        // if that is smaller.
        var limit = 5;
        if (pages < 5) {
            limit = pages;
        }
        
        // start at page - half the limit
        var astart = page - parseInt(limit / 2);
        
        // if that puts the last page shown as greater than the number
        // of pages, then move it back to the first start point that
        // doesn't cause an overrun.
        if (this.getFinish(astart,limit) > pages) {
            astart = pages - limit + 1;
        }
        
        // force start to the first page if the start is less than 1.
        if (astart < 1) {
            astart = 1;
        }
    
        var _results = [];
        var _i;
        var num;
        for (num = _i = astart; _i <= this.getFinish(astart,limit); num = ++_i) {
            _results.push(num);
        }
        return _results;
        
    }.property('page', 'pages'),
  
    actions: {
        goToNextPage: function(){
            if (this.get('hasNext')) {
                this.incrementProperty('page');
            }
        },
    
        goToPreviousPage: function(){
            if (this.get('hasPrevious')) {
                this.decrementProperty('page');
            }
        },
        
        goToPage: function(pageNumber) {
            console.log(pageNumber);
            if ((pageNumber >= 1) && (pageNumber <= this.get('lastPage'))) {
                this.set('page', pageNumber);
            }
        }
    }
});

export default PeopleController;  