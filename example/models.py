from datetime import datetime

from django.db import models
from django.contrib.auth.models import User, Group 

#http://stackoverflow.com/questions/1760421/how-can-i-render-a-manytomanyfield-as-checkboxes
class Person(models.Model):
    """
    """
    user = models.ForeignKey(User, blank=True, null=True, unique=True)
    FirstName = models.CharField(max_length=100)
    LastName = models.CharField(max_length=100)
    Company = models.CharField(max_length=100)
    Address = models.CharField(max_length=300,blank=True, null=True)
    Address1 = models.CharField(max_length=300, blank=True, null=True)
    City = models.CharField(max_length=300, blank=True, null=True)
    State = models.CharField(max_length=300, blank=True, null=True)
    Zip = models.CharField(max_length=300, blank=True, null=True)
    Telephone = models.CharField(max_length=50, blank=True, null=True)
    Fax = models.CharField(max_length=50, blank=True, null=True)
    Cell = models.CharField(max_length=50, blank=True, null=True)
    Email = models.CharField(max_length=300, blank=True, null=True)
    Website = models.CharField(max_length=300, blank=True, null=True)
    Facebook = models.CharField(max_length=300, blank=True, null=True)
    Twitter = models.CharField(max_length=300, blank=True, null=True)
    DateSubmitted = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return "%s %s" % (self.FirstName, self.LastName)
    
    def __unicode__(self):
        return "%s %s" % (self.FirstName, self.LastName)
    