from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ParseError
 
class EmberJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = {}
        # Name the object list 
        object_list = 'results'
        try:
            meta_dict = getattr(renderer_context.get('view').get_serializer().Meta, 'meta_dict')
        except:
            meta_dict = dict()
        
        resource_name = getattr(renderer_context.get('view').get_serializer().Meta, 'resource_name', 'results')
        meta_dict['resource'] = resource_name
        
        try:
            if "results" in data:
                response_data[resource_name] = data['results']
                response_data['meta'] = dict()
                # Add custom meta data
                response_data['meta'].update(meta_dict)
                response_data['meta'].update(data['meta'])
                # Call super to render the response
            else:
                response_data[resource_name] = data
        except KeyError:
            raise ParseError()
            
        return super(EmberJSONRenderer, self).render(response_data, accepted_media_type, renderer_context)