from django.conf.urls import patterns, include, url
from django.contrib.auth.models import User, Group
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin           
import autocomplete_light

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
 
autocomplete_light.autodiscover()
admin.autodiscover()

from example.models import Person
from rest_framework import viewsets, routers


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'example.views.home', name='home'),
    url(r'^foundation$', 'example.views.foundation', name='foundation'),
    url(r'^ember$', 'example.views.ember', name='ember'),
    # url(r'^operis/', include('operis.foo.urls')),
    (r'^', include('api.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    
    #For AutoComplete
    url(r'^autocomplete/', include('autocomplete_light.urls')),
    
)+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
