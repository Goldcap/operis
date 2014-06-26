//import User from 'operis/models/user';

var {{ type }} = DS.Model.extend({
  {%- for field in model -%}
  {% if field.type == "CharField" %}
  {{field.name}}: DS.attr('string'){% if not loop.last %},{% endif %}
  {%- endif %}
  {%- endfor %}
});

export default {{ type }};
