import re

def convert(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()    
     
def convert_friendly(name):
    return re.sub("([a-z])([A-Z])","\g<1> \g<2>",name)
    