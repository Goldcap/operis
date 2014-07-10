import re

def convert(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()   
    
def unconvert(name):
    #splitted_string = name.split('_')
    # use string's class to work on the string to keep its type
    #class_ = name.__class__
    #return class_.join('', map(class_.capitalize, splitted_string))
    return re.sub("(^|_)([a-zA-Z])", lambda m: m.group(2).capitalize(), name)
     
def convert_friendly(name):
    return re.sub("([a-z])([A-Z])","\g<1> \g<2>",name)
    