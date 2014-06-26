import datetime
from collections import defaultdict

from django.core.management.base import BaseCommand, CommandError
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

from jinja2 import FileSystemLoader, Environment, PackageLoader, ChoiceLoader

from example.models import Person                                            
from operis.log import log

#This command takes an input table of artifacts, of a specific format,
#And ensures that image attatchments for each artifact in the table are created
#Then sets those images up to be parsed by the IKGEN.py

class Command(BaseCommand):
    help = 'Creates Generic Ember Models' 
    logger = None
    
    def handle(self, *args, **options):
        
        self.logger = log( self )
        
        models = defaultdict(list)
        model = []
        for f in Person._meta.fields:
            field = {}
            field['name'] = f.name
            field['type'] = f.get_internal_type()
            self.logger.log("Field %s",[f.name],"info")
            self.logger.log("Field %s",[field['type']],"info")
            model.append(field)
            # resolve picklists/choices, with get_xyz_display() function
        models["Person"] = model
        #print models        
    
        global_exts = getattr(settings, 'JINJA_EXTS', ())
        env = Environment(extensions=global_exts,loader=FileSystemLoader('templates'))
        for k,v in models.iteritems():
            template = env.get_template('ember/models/model.js')
            args = {"type":k,"model":v}
            output = template.render(args)
            print output

        #self.logger.log("HOWDY %s",["Folks"],"info")
        
        """
        for field in ArtifactField.objects.all():
            self.logger.log("FIELD IS %s",[field],"info")
        
            obj,created = Permission.objects.get_or_create(
                                    permission = 'r',
                                    user_id = '-1',
                                    parent_user_id = 0,
                                    active = 1,
                                    content_type = ContentType.objects.get_for_model(field),
                                    object_id = field.id,
                                    parent_content_type = ContentType.objects.get(pk=22),
                                    parent_object_id = 0)
            obj.created = datetime.datetime.now()
            obj.save()
        """