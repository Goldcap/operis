from rest_framework import serializers

class CurrentPageField(serializers.Field):
    """
    Field that returns a querystring value.
    """
    
    def to_native(self, object):
        request = self.context.get('request')
        try:
            return int(request.GET["page"])
        except KeyError:
            return 1