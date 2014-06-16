from django.contrib.auth.models import User, Group
from rest_framework import generics,viewsets

from example.models import Person
from api.serializers import PersonSerializer, UserSerializer


class People(generics.ListCreateAPIView):
    model = Person
    serializer_class = PersonSerializer
    filter_fields = ['FirstName','LastName']

class Person(generics.RetrieveUpdateDestroyAPIView):
    model = Person
    serializer_class = PersonSerializer
        
#class PeopleViewSet(viewsets.ModelViewSet):
#    """
#    API endpoint that allows groups to be viewed or edited.
#    """
#    queryset = Person.objects.all()
#    serializer_class = PersonSerializer
#    filter_fields = ['FirstName','LastName']

    
class Users(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class User(generics.RetrieveUpdateDestroyAPIView):
    model = User
    serializer_class = UserSerializer