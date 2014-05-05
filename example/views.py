from django.template.context import RequestContext
from django.shortcuts import render_to_response, get_object_or_404

def home(request):
    """
    page index
    """
    
    return render_to_response('home.html', {
    }, context_instance=RequestContext(request))

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
