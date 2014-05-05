from django.conf.urls.defaults import patterns, url

from api import serializers
from rest_framework import renderers
from rest_framework.urlpatterns import format_suffix_patterns

UUID_REGEX = r'[\w\-]*'
UUID_LIST_REGEX = r'([\w\-]+)(,\s*[\w\-]+)*'
UUID_PK_REGEX = r'([\d]+)(,\s*[\d]+)*'

# Each of these URL endpoints acts as a dispatch
# Unless otherwise specified,
# Using the HTTP REQUEST Method

people_list = serializers.PeopleViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
people_detail = serializers.PeopleViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

user_list = serializers.UserViewSet.as_view({
    'get': 'list'
})
user_detail = serializers.UserViewSet.as_view({
    'get': 'retrieve'
})

urlpatterns = patterns('api.serializers',
    
    url(r'^api/?$', 'api_root'),
    url(r'^api/people/$', people_list, name='people-list'),
    url(r'^api/people/(?P<pk>[0-9]+)/?$', people_detail, name='people-detail'),
    url(r'^users/$', user_list, name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user-detail'),
    #url(r'^api/people/?$', serializers.PersonListApi.as_view()),
    #url(r'^api/person/(?P<person_ids>%s)/?$' % UUID_LIST_REGEX, serializers.PersonDetailApi.as_view()),
    
)

urlpatterns = format_suffix_patterns(urlpatterns)    