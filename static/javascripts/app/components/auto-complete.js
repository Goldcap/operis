var Autocomplete = Ember.Component.extend({
    
    searchText: null,
        
    searchResults: function() {
        var st = this.get("searchText");
        if (! st) return;
        
        var regex = new RegExp(st,'i');
        return ['one','two','three'].filter(function(name) {
            return name.match(regex);
        });
        
    }.property('searchText'),
    
    
    actions: {
        showConfirmation: function() {
            this.toggleProperty('isShowingConfirmation'); 
        },
        
        confirm: function() {
            this.toggleProperty('isShowingConfirmation');
            //this.sendAction('action', this.get('param'));
        }
    }  
});

export default Autocomplete;