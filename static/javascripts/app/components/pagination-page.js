var PaginationPage = Ember.Component.extend({
    
    tagName: 'li',
    classNameBindings: 'isCurrent',
    
    isCurrent: function() {
        if (this.get('page') == this.get('page_number')) {
            return "current";
        }
        return "";
    }.property('page', 'page_number')
      
});

export default PaginationPage;