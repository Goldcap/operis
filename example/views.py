from django.template.context import RequestContext
from django.shortcuts import render_to_response, get_object_or_404
from django.utils.safestring import SafeString
from django.conf import settings

def home(request):
    """
    page index
    """
    response_dict = {
        'ember_app_name': settings.EMBER_APP_NAME,
        'ember_env': SafeString(settings.EMBER_ENV),
    }
    return render_to_response('home.html', { 'settings': response_dict }, 
            context_instance=RequestContext(request))

def foundation(request):
    """
    page index
    """
    
    return render_to_response('foundation.html', {
    }, context_instance=RequestContext(request))

def ember(request):
    """
    page index
    """
    
    return render_to_response('ember.html', {
    }, context_instance=RequestContext(request))
