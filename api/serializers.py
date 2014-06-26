from django.contrib.auth.models import User, Group   
from rest_framework import pagination
from rest_framework import serializers
from api import fields

from example.models import Person

class CustomMetaSerializer(serializers.Serializer):
    count = serializers.Field(source='paginator.count')
    num_pages = serializers.Field(source='paginator.num_pages')
    current_page = fields.CurrentPageField(source='paginator') 
    
class CustomPaginationSerializer(pagination.BasePaginationSerializer):
    # Takes the page object as the source
    meta = CustomMetaSerializer(source='*')
    results_field = 'results'
    
class PersonSerializer(serializers.ModelSerializer):
    
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
        #meta_dict = dict()
        #meta_dict['foo'] = 'bar'
        resource_name = 'people'
        result_name = 'people'
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
        
class UserSerializer(serializers.ModelSerializer):
    
    id = serializers.Field()  # Note: `Field` is an untyped read-only field.
    
    class Meta:
        model = User
        resource_name = 'user'
        result_name = 'results'
        fields = ('id', 'username', 'email')

    
