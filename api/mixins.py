class ListByIdMixin(object):
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
        #return Response(status=status.HTTP_204_NO_CONTENT)
        
    def get_queryset(self):
        """
        Get the list of items for this view.
        This must be an iterable, and may be a queryset.
        Defaults to using `self.queryset`.

        You may want to override this if you need to provide different
        querysets depending on the incoming request.

        (Eg. return a list of items that is specific to the user)
        """
        if self.queryset is not None:
            queryset = self.queryset._clone()

        if self.model is not None:
            queryset = self.model._default_manager.all()

        id_values = self.request.QUERY_PARAMS.getlist('ids[]', None)
        if not id_values:
            id_values = self.request.QUERY_PARAMS.getlist('id', None)
        
        if id_values:
            self.paginate_by = None
            queryset = queryset.filter(id__in=id_values)
            if (hasattr(self,"ordering")) and (self.ordering is not None):
                for item in self.ordering:
                    queryset = queryset.order_by(item)

        if queryset is not None:
            return queryset
        
        raise ImproperlyConfigured("'%s' must define 'queryset' or 'model'"
                                    % self.__class__.__name__)
                                    
class ChildrenByIdMixin(object):
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
        #return Response(status=status.HTTP_204_NO_CONTENT)
        
    def get_queryset(self):
        """
        Get the list of items for this view.
        This must be an iterable, and may be a queryset.
        Defaults to using `self.queryset`.

        You may want to override this if you need to provide different
        querysets depending on the incoming request.

        (Eg. return a list of items that is specific to the user)
        """
        if self.queryset is not None:
            queryset = self.queryset._clone()

        if self.model is not None:
            queryset = self.model._default_manager.all()

        print self.kwargs["pk"]
        
        queryset = queryset.filter(ppfa_test__id=self.kwargs["pk"])
        
        if queryset is not None:
            return queryset
        
        raise ImproperlyConfigured("'%s' must define 'queryset' or 'model'"
                                    % self.__class__.__name__)
                                    
    