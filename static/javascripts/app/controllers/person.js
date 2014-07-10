import OperisPersonController from 'operis/controllers/operis-person';

var PersonController = OperisPersonController.extend({
   
    searchText: null,
   
    searchResults: function() {
        var st = this.get("searchText");
        if (! st) return;
        return this.store.find('person', { first_name: st });
        
        /*
        var regex = new RegExp(st,'i');
        return ['one','two','three'].filter(function(name) {
            return name.match(regex);
        });
        */
        
    }.property('searchText'),
    
    actions: {
        
        kiss: function() {
            alert("Mwa! We love " + this.get('content.first_name') + "!");
        }
   }
   
});

export default PersonController;