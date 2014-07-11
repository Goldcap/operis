from django.contrib.auth.models import User, Group
from rest_framework import generics,viewsets

from example.models import Person
from api.serializers import PersonSerializer, UserSerializer, CustomPaginationSerializer
from api.renderers import EmberJSONRenderer
from api.filters import SearchFilter


class People(generics.ListCreateAPIView):
    model = Person
    serializer_class = PersonSerializer
    filter_fields = ['first_name','last_name'] 
    renderer_classes = (EmberJSONRenderer,)
    filter_backends = (SearchFilter,)
    search_fields = ['first_name']
    
class Person(generics.RetrieveUpdateDestroyAPIView):
    model = Person
    serializer_class = PersonSerializer
    renderer_classes = (EmberJSONRenderer,)
    
class Users(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    renderer_classes = (EmberJSONRenderer,)
    
class User(generics.RetrieveUpdateDestroyAPIView):
    model = User
    serializer_class = UserSerializer
    renderer_classes = (EmberJSONRenderer,)
    
    