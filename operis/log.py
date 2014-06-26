from datetime import datetime
from time import time
import string
import os
import logging
import rfc3339

from django.utils.termcolors import colorize

class log():

    Command = None
    stdout = None
    stderr = None
    color = "red"
    logger = logging.getLogger('log')
    
    def __init__( self, Command=None ):
        self.Command = Command
        
        if self.Command != None:
            self.stdout = self.Command.stdout
            self.stderr = self.Command.stderr
        
    def clog( self, message, args=None, color="cyan" ):
        if self.Command != None:
            params = []
            if args != None:
                for arg in args:
                    if arg != None:
                        try:
                            params.append(colorize(unicode(arg), fg=color))
                        except:
                            params.append(colorize("caught error", fg=color))
                if params != None:
                    self.stderr.write(message % tuple(params))
                else:
                    self.stderr.write(message)
            else:
                self.stderr.write(message)
            #self.stderr.write("\n")
        
    def log( self, message, args=None, logtype="notice", notify=None ):
        
        color = "cyan"
        
        if args == None:
            args = ()
        
        try:
            if len(args) == 1:
                assignments = args
            else:
                assignments = tuple(args)
        except:
            assignments = None
        
        #print assignments
        try:
            if logtype == "error":
                self.logger.error(message % assignments)
                color = "red"
            elif logtype == "notice":
                self.logger.info(message % assignments)
                color = "cyan"
            elif logtype == "warning":
                self.logger.warning(message % assignments)
                color = "blue"
            elif logtype == "success":
                self.logger.info(message % assignments)
                color = "green"
            elif logtype == "info":
                self.logger.info(message % assignments)
                color = "yellow"
            elif logtype == "debug":
                self.logger.debug(message % assignments)
                color = "magenta"
            elif logtype == "critical":
                self.logger.critical(message % assignments)
                color = "purple"
            
            if self.stdout != None:
                self.clog(message, args, color)
            else:
                print (message % assignments) 
        except:
            pass       
           
        
                