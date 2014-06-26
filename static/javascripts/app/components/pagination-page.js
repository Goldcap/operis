var PaginationPage = Ember.Component.extend({
    tagName: 'li',
    classNameBindings: 'isCurrent:disabled',
    
    isCurrent: function() {
        if (this.get('currentPage') == this.get('page')) return true;
    }.property('currentPage', 'page'),
    
    actions: {
        pageClicked: function() {
            this.get('parentView').send('goToPage', this.get('page'));
        }
    }
      
});

export default PaginationPage;