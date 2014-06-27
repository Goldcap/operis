var PaginationLinks = Ember.Component.extend({
    
    hasPrevious: function() {
        if (this.get('current_page') > 1) return true;
    }.property('current_page'),
    
    hasNext: function() {
        if (this.get('current_page') + 1 < this.get('num_pages')) return true;
    }.property('current_page', 'num_pages'),
    
    showPagination: Em.computed.gt('num_pages', 1),
     
    lastPage:  Em.computed.alias('num_pages'),
    
    showBeforeEllipsis: function() {
        if (this.get('visiblePages.firstObject') > 3) return true;
    }.property('visiblePages.[]'),
    
    showAfterEllipsis: function() {
        if  (Math.abs(this.get('lastPage') - this.get('visiblePages.lastObject')) > 2) return true;
    }.property('visiblePages.[]', 'lastPage'),

    getFinish: function( start, limit ) {
        return start + limit - 1;
    },
      
    visiblePages: function() {
        var num_pages = this.get('num_pages');
        var current_page  = this.get('current_page');
    
        // limit the number of pages to five, or the number of pages
        // if that is smaller.
        var limit = 5;
        if (num_pages < 5) {
            limit = num_pages;
        }
        
        // start at page - half the limit
        var astart = current_page - parseInt(limit / 2);
        
        // if that puts the last page shown as greater than the number
        // of pages, then move it back to the first start point that
        // doesn't cause an overrun.
        if (this.getFinish(astart,limit) > num_pages) {
            astart = num_pages - limit + 1;
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
        
    }.property('current_page', 'num_pages'),
    
    actions: {
        goToNextPage: function(){
            if (this.get('hasNext')) {
                this.incrementProperty('controller.current_page');
            }
        },
    
        goToPreviousPage: function(){
            if (this.get('hasPrevious')) {
                this.decrementProperty('controller.current_page');
            }
        },
        
        goToPage: function(pageNumber) {
            if ((pageNumber >= 1) && (pageNumber <= this.get('lastPage'))) {
                this.set('controller.current_page', pageNumber);
            }
        }
    }
      
});

export default PaginationLinks;