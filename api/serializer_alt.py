import logging
import json

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator 
from django.forms import widgets

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import permissions
from rest_framework import serializers
from rest_framework import mixins
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication

from django.contrib.auth.models import User
from example.models import Person

logger = logging.getLogger(__name__)

code=status.HTTP_200_OK

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:            
            return True

        # Write permissions are only allowed to the owner of the snippet
        return obj.owner == request.user
        
@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'people': reverse('people-list', request=request, format=format)
    })
    
class UserSerializer(serializers.ModelSerializer):
    people = serializers.PrimaryKeyRelatedField(many=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'people')

        
class PeopleSerializer(serializers.Serializer):
    
    pk = serializers.Field()  # Note: `Field` is an untyped read-only field.
    FirstName = serializers.CharField(required=False,
                                  max_length=100)
    LastName = serializers.CharField(required=False,
                                  max_length=100)
    user = serializers.Field(source='user.username')
    
    class Meta:
        model = Person
        fields = ('FirstName', 'LastName', 'user')
        
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


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
        
        
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class PeopleViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    queryset = Person.objects.all()
    serializer_class = PeopleSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)

    def pre_save(self, obj):
        obj.user = self.request.user

            
class PeopleList(generics.ListCreateAPIView):
    
    queryset = Person.objects.all()
    serializer_class = PeopleSerializer

    def pre_save(self, obj):
        obj.owner = self.request.user


class PeopleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PeopleSerializer
    
    def pre_save(self, obj):
        obj.owner = self.request.user

                        
class PeopleListApi(APIView):
    """
    Paginated list of Persons.
    """
    #authentication_classes = (SessionAuthentication, HukksterAuthentication, )
    #permission_classes = (permissions.IsAuthenticated,)
    
    @method_decorator(csrf_exempt)
    def get(self, request, format=None):
        
        people = Person.objects.filter()
        
        if not people:
            code = status.HTTP_404_NOT_FOUND
            #data = jsonHttpResponse(request, [], status=code)
            #return Response(data, status=code)
            return Response([], status=code)
        else:
            serializer = PersonSerializer(people,many=True)
            code = status.HTTP_200_OK
            
        #data = jsonHttpResponse(request, serializer.data, status=code)
        #return Response(data, status=code)
        return Response(serializer.data, status=code)
    
    
class PeopleDetailApi(APIView):
    """
    Retrieve, update or delete a person.
    """
    #authentication_classes = (SessionAuthentication, HukksterAuthentication, )
    #permission_classes = (permissions.IsAuthenticated, )
    
    @method_decorator(csrf_exempt)
    def get(self, request, person_ids=None, format=None):
        
        personids = person_ids.split(",")
        objects = Person.objects.filter(pk__in=personids)
        
        #total = Person.objects.count()
        #stats = {"count":len(objects),"offset":0,"rpp":0,"total":total}
        
        if not objects:
            code = status.HTTP_204_NO_CONTENT
            #data = jsonHttpResponse(request, [], status=code)
            #return Response(data, status=code))
            return Response([], status=code)
        else:
            serializer = PersonSerializer(objects,many=True)
            code = status.HTTP_200_OK
            
        #data = jsonHttpResponse(request, serializer.data, status=code, stats=stats)
        #return Response(data, status=code)
        return Response(serializer.data, status=code)
    
    
    @method_decorator(csrf_exempt)
    def put(self, request, user_ids=None, format=None):
        
        person = PersonSerializer(snippet, data=request.DATA)
        if person.is_valid():
            person.save()
            return Response(person.data)
        else:
            return Response(person.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @method_decorator(csrf_exempt)
    def post(self, request, user_ids=None, format=None):
        
        person = PersonSerializer(data=request.DATA)
        if person.is_valid():
            person.save()
            return Response(person.data, status=status.HTTP_201_CREATED)
        else:
            return Response(person.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @method_decorator(csrf_exempt)
    def delete(self, request, person_ids=None, format=None):
       
        personids = person_ids.split(",")
        objects = Person.objects.filter(pk__in=personids)
        
        if not objects:
            code = status.HTTP_204_NO_CONTENT
            #data = jsonHttpResponse(request, [], status=code)
            #return Response(data, status=code))
            #return Response([], status=code)
        else:
            objects.delete()
            code = status.HTTP_204_NO_CONTENT
            
        #data = jsonHttpResponse(request, serializer.data, status=code, stats=stats)
        #return Response(data, status=code)
        return Response(status=status.HTTP_204_NO_CONTENT)    