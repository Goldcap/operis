var PaginationPage = Ember.Component.extend({
    tagName: 'li',
    classNameBindings: 'isCurrent',
    
    isCurrent: function() {
        if (this.get('current_page') == this.get('page')) {
            return "current";
        }
        return "";
    }.property('current_page', 'page'),
    
    actions: {
        pageClicked: function() {
            this.get('parentView').send('goToPage', this.get('page'));
        }
    }
      
});

export default PaginationPage;