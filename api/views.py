from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from example.models import Person
from api.serializers import PersonSerializer, UserSerializer


class PeopleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_fields = ['FirstName','LastName']

    
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer