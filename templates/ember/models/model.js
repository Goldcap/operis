import Ember from 'ember';
import DS from "ember-data";

var Operis{{ model.singular }} = DS.Model.extend(Ember.Validations.Mixin,{
  {%- for field in model.model -%}
  {%- if field.type == "BooleanField" %}
  {{field.name_underscore}}: DS.attr('boolean'){% if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "CharField" %}
  {{field.name_underscore}}: DS.attr('string'){% if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "ChoiceField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "TypedChoiceField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "DateField" %}
  {{field.name_underscore}}: DS.attr('date'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "DateTimeField" %}
  {{field.name_underscore}}: DS.attr('isodate'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "DecimalField" %}
  {{field.name_underscore}}: DS.attr('number'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "EmailField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "FileField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "FilePathField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "FloatField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "ImageField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "IntegerField" %}
  {{field.name_underscore}}: DS.attr('number'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "IPAddressField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "GenericIPAddressField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "MultipleChoiceField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- if field.type == "TypedMultipleChoiceField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- if field.type == "NullBooleanField" %}
  {{field.name_underscore}}: DS.attr('boolean'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "RegexField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "SlugField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "TimeField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "URLField" %}
  {{field.name_underscore}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "ForeignKey" %}
  {{field.name_underscore}}: DS.belongsTo('{{field.parent}}',{async:true}){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- if field.type == "ManyToManyField" %}
  {{field.name_underscore}}: DS.hasMany('{{field.parent}}',{% raw %}{{% endraw %}async:true{% raw %}}{% endraw %}){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- if field.type == "OneToMany" %}
  {{field.plural_name_underscore}}: DS.hasMany('{{field.plural_name_underscore}}',{% raw %}{{% endraw %}async:true{% raw %}}{% endraw %}){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- endfor %}
});
export default Operis{{ model.singular }};
