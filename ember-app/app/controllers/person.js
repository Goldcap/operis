//https://www.youtube.com/watch?v=7twifrxOTQY
import OperisPersonController from 'ember-app/controllers/operis-person';

var PersonController = OperisPersonController.extend({
   
    actions: {
        
        kiss: function() {
            alert("Mwa! We love " + this.get('content.first_name') + "!");
        }
   }
   
});

export default PersonController;