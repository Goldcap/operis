from django.contrib.auth.models import User, Group
from rest_framework import serializers

from example.models import Person


class PersonSerializer(serializers.Serializer):
    
    id = serializers.Field()  # Note: `Field` is an untyped read-only field.
    first_name = serializers.CharField(required=False,
                                  max_length=100,
                                  source='FirstName')
    last_name = serializers.CharField(required=False,
                                  max_length=100,
                                  source='LastName')
    user = serializers.Field(source='user.pk')
    
    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'user')
        
    def restore_object(self, attrs, instance=None):
        """
        Create or update a new snippet instance, given a dictionary
        of deserialized field values.

        Note that if we don't define this method, then deserializing
        data will simply return a dictionary of items.
        """
        if instance:
            # Update existing instance
            instance.FirstName = attrs.get('FirstName', instance.FirstName)
            instance.LastName = attrs.get('LastName', instance.LastName)
            return instance

        # Create new instance
        return Person(**attrs)
        
class UserSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.Field()  # Note: `Field` is an untyped read-only field.
    
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'groups')
