import Operis{{ model.singular }} from 'ember-app/models/operis/operis-{{ model.singular_converted }}';

var {{ model.singular }} = Operis{{ model.singular }}.extend({});

export default {{ model.singular }};