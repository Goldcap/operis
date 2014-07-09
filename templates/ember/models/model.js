var Operis{{ model.singular }} = DS.Model.extend(Ember.Validations.Mixin,{
  {%- for field in model.model -%} 
  {%- if field.type == "BooleanField" %}
  {{field.name}}: DS.attr('boolean'){% if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "CharField" %}
  {{field.name}}: DS.attr('string'){% if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "ChoiceField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "TypedChoiceField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "DateField" %}
  {{field.name}}: DS.attr('date'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "DateTimeField" %}
  {{field.name}}: DS.attr('date'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "DecimalField" %}
  {{field.name}}: DS.attr('number'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "EmailField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "FileField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "FilePathField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "FloatField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "ImageField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "IntegerField" %}
  {{field.name}}: DS.attr('number'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "IPAddressField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "GenericIPAddressField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "MultipleChoiceField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- if field.type == "TypedMultipleChoiceField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %} 
  {%- if field.type == "NullBooleanField" %}
  {{field.name}}: DS.attr('boolean'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "RegexField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "SlugField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "TimeField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "URLField" %}
  {{field.name}}: DS.attr('string'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- if field.type == "ForeignKey" %}
  {{field.name}}: DS.belongsTo('{{field.name}}'){%- if not loop.last %},{% endif %}
  {%- endif %}
  {%- endfor %}
});
export default Operis{{ model.singular }};
