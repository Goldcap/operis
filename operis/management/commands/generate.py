import datetime                         
import sys
import os.path
import pprint
from inspect import getmembers, isclass
from collections import defaultdict
from optparse import make_option

from django.core.management.base import BaseCommand, CommandError
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.db.models.base import ModelBase

from jinja2 import FileSystemLoader, Environment, PackageLoader, ChoiceLoader

from operis.log import log
from operis.utils import clean, convert, convert_friendly, underscore

#This command takes an input table of artifacts, of a specific format,
#And ensures that image attatchments for each artifact in the table are created
#Then sets those images up to be parsed by the IKGEN.py

class Command(BaseCommand):
    help = 'Creates Generic Ember Models' 
    logger = None
    
    option_list = BaseCommand.option_list + (
        make_option('--regenerate',
            action='store_true',
            dest='regenerate',
            default=False,
            help='Wipe Prior instances'),
        )

    def handle(self, *args, **options):
        
        self.logger = log( self )
        
        wipe = False
        if options['regenerate']:
            wipe = True
        
        modules = map(__import__, settings.EMBER_MODELS)
        
        model_instances = defaultdict(list)
        for model in modules:
            for name, obj in getmembers(model.models):
                if isclass(obj):
                    model = []
                    if isinstance(obj, ModelBase):
                        self.logger.log("Object Name is: %s",[obj.__name__],"info")
                        has_parent = False
                        
                        for aname in obj._meta.get_all_field_names():
                            f, modelItem, direct, m2m = obj._meta.get_field_by_name(aname)
                            self.logger.log("Field %s",[f.name],"info")
                            try:
                                self.logger.log("Field Type is: %s",[f.get_internal_type()],"info")
                            except:
                                #for a in dir(f):
                                #    print "%s = %s" % (a,getattr(f,a))
                                continue
                                #sys.exit(0)
                        
                            if hasattr(obj ,"Ember") and hasattr(obj.Ember,'fields'):
                                if f.name not in obj.Ember.fields:
                                    continue
                            field = {}
                            field['name'] = convert(f.name) 
                            field['name_underscore'] = underscore(f.name) 
                            field['name_friendly'] = convert_friendly(f.name)
                            field['type'] = f.get_internal_type()
                            
                            if field['type'] == "ForeignKey" or field['type'] == "ManyToManyField":
                                has_parent = True
                                field['parent'] = underscore(f.rel.to.__name__)
                                
                            #self.logger.log("Field %s",[field['type']],"info")
                            model.append(field)
                            # resolve picklists/choices, with get_xyz_display() function
                        
                        """
                        #Generate Implied One-To-Many Relationships
                        #This is experimental, and potentially deprecated
                        for f in obj._meta.get_all_related_objects():
                            self.logger.log("One-To-Many Field Name is: %s",[f.name],"info")
                            self.logger.log("One-To-Many Field Type is: %s",['OneToMany'],"info")
                            
                            field = {}
                            field['name'] = convert(f.name)
                            field['name_underscore'] = underscore(f.name)
                            field['name_friendly'] = convert_friendly(f.opts.module_name)
                            field['type'] = "OneToMany"   
                            
                            if hasattr(f.model._meta ,"verbose_name_plural"):
                                field['plural_name'] = convert(unicode(f.model._meta.verbose_name_plural))
                                field['plural_name_underscore'] = underscore(unicode(f.model._meta.verbose_name_plural))
                  
                            model.append(field)
                        """
                            
                        index_list = ['id']
                        index_converted = []
                        plural = None
                        plural_converted = None
                        
                        #Add to our Plural-Item Controllers
                        if hasattr(obj ,"Ember"):
                            if hasattr(obj.Ember,'index_list'):
                                index_list = []
                                for f in obj.Ember.index_list:
                                    index_list.append(convert(f))
                                    index_converted.append(convert_friendly(f))
                                    # resolve picklists/choices, with get_xyz_display() function
                               
                        if hasattr(obj._meta ,"verbose_name_plural"):
                            plural = unicode(obj._meta.verbose_name_plural)
                        else:
                            plural = plural.title()
                            
                        item = {    "model": model, 
                                    "singular": unicode(obj.__name__).title(), 
                                    "singular_converted": convert(unicode(obj.__name__)),
                                    "plural": clean(plural),
                                    "plural_converted": convert(plural),
                                    "index_list": index_list,
                                    "index_converted": index_converted,
                                    "has_parent": has_parent
                                }
                        
                        #if (obj.__name__ == "EventItemTag"):
                            #pp = pprint.PrettyPrinter(indent=4)
                            #pp.pprint(item["model"])
                            #sys.exit(0)
                        
                        model_instances[obj.__name__] = item
                        print "=============================="
                        #print obj.__name__
        #sys.exit(0)
                         
        global_exts = getattr(settings, 'JINJA_EXTS', ())
        env = Environment(extensions=global_exts,loader=FileSystemLoader('templates'))
        basedir = settings.PROJECT_DIR + "/../" + settings.EMBER_APP_NAME
        
        #Create Operis Subdirectories        
        if not os.path.exists(basedir+ "/app/controllers/operis"):
            os.makedirs(basedir+ "/app/controllers/operis")
        if not os.path.exists(basedir+ "/app/models/operis"):
            os.makedirs(basedir+ "/app/models/operis")
        if not os.path.exists(basedir+ "/app/routes/operis"):
            os.makedirs(basedir+ "/app/routes/operis")
        if not os.path.exists(basedir+ "/app/templates/operis"):
            os.makedirs(basedir+ "/app/templates/operis")
                        
        self.logger.log("Directory is %s",[basedir],"info")
        
        for k,v in model_instances.iteritems():
            
            self.logger.log("Creating Base Model for %s",[k],"info")
            self.logger.log("Has Parent is: %s",[v['has_parent']],"info")
                        
            template = env.get_template('ember/models/model.js')
            filename = basedir + "/app/models/operis/operis-" + v["singular_converted"] + ".js"
            args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
            output = template.render(args)
            file = open(filename, "w")
            file.write(output)
            file.close()
            
            filename = basedir + "/app/models/" + v["singular_converted"] + ".js"
            if not os.path.isfile(filename) or wipe:
                self.logger.log("Creating Instance Model for %s",[k],"info")
                template = env.get_template('ember/models/instance.js')
                args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                output = template.render(args)
                file = open(filename, "w")
                file.write(output)
                file.close()
        
            self.logger.log("Creating Single Base Controller for %s",[k],"info")
            template = env.get_template('ember/controllers/single.js')
            filename = basedir + "/app/controllers/operis/operis-" + v["singular_converted"] + ".js"
            args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
            output = template.render(args)
            file = open(filename, "w")
            file.write(output)
            file.close()
            
            filename = basedir + "/app/controllers/" + v["singular_converted"] + ".js"
            if not os.path.isfile(filename) or wipe:
                self.logger.log("Creating Single Instance Controller for %s",[k],"info")
                template = env.get_template('ember/controllers/instance_single.js')
                args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                output = template.render(args)
                file = open(filename, "w")
                file.write(output)
                file.close()
            
            self.logger.log("Creating Base Route for %s",[k],"info")
            template = env.get_template('ember/routes/single.js')
            filename = basedir + "/app/routes/operis/operis-" + v["singular_converted"] + ".js"
            args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
            output = template.render(args)
            file = open(filename, "w")
            file.write(output)
            file.close()
            
            filename = basedir + "/app/routes/" + v["singular_converted"] + ".js"
            if not os.path.isfile(filename) or wipe:
                self.logger.log("Creating Single Instance Route for %s",[k],"info")
                template = env.get_template('ember/routes/instance_single.js')
                args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                output = template.render(args)
                file = open(filename, "w")
                file.write(output)
                file.close()

            filename = basedir + "/app/templates/" + v["singular_converted"] + ".hbs"
            if not os.path.isfile(filename) or wipe:
                self.logger.log("Creating Single Base Template for %s",[k],"info")
                template = env.get_template('ember/templates/single.handlebars')
                args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                output = template.render(args)
                file = open(filename, "w")
                file.write(output)
                file.close()
            
            if v["plural"]: 
                
                self.logger.log("Creating Plural Base Controller for %s",[k],"info")
                template = env.get_template('ember/controllers/plural.js')
                filename = basedir + "/app/controllers/operis/operis-" + v["plural_converted"] + ".js"
                args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                output = template.render(args)
                file = open(filename, "w")
                file.write(output)
                file.close()
                
                filename = basedir + "/app/controllers/" + v["plural_converted"] + ".js"
                if not os.path.isfile(filename) or wipe:
                    self.logger.log("Creating Plural Instance Controller for %s",[k],"info")
                    template = env.get_template('ember/controllers/instance_plural.js')
                    args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                    output = template.render(args)
                    file = open(filename, "w")
                    file.write(output)
                    file.close()
                    
                self.logger.log("Creating Plural Base Route for %s",[k],"info")
                template = env.get_template('ember/routes/plural.js')
                filename = basedir + "/app/routes/operis/operis-" + v["plural_converted"] + ".js"
                args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                output = template.render(args)
                file = open(filename, "w")
                file.write(output)
                file.close()
                
                filename = basedir + "/app/routes/" + v["plural_converted"] + ".js"
                if not os.path.isfile(filename) or wipe:
                    self.logger.log("Creating Plural Instance Route for %s",[k],"info")
                    template = env.get_template('ember/routes/instance_plural.js')
                    args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                    output = template.render(args)
                    file = open(filename, "w")
                    file.write(output)
                    file.close()
    
                filename = basedir + "/app/templates/" + v["plural_converted"] + ".hbs"
                if not os.path.isfile(filename) or wipe:
                    self.logger.log("Creating Plural Template for %s",[k],"info")
                    template = env.get_template('ember/templates/plural.handlebars')
                    args = {"model":v,"ember_app_name":settings.EMBER_APP_NAME}
                    output = template.render(args)
                    file = open(filename, "w")
                    file.write(output)
                    file.close()
                
            
        self.logger.log("Done, templates are in %s",[settings.EMBER_APP_NAME],"info")
        