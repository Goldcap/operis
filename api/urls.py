from django.conf.urls import patterns, url, include
from rest_framework import viewsets, routers
from api.views import Person, People, User, Users


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^api/people/(?P<pk>\d+)($|/$)', Person.as_view()),
    url(r'^api/people($|/$)', People.as_view()),           
    url(r'^api/users/(?P<pk>\d+)($|/$)', User.as_view()),
    url(r'^api/users($|/$)', Users.as_view()),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)