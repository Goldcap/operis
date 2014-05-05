Operis
======

Multi JS MVC Implementation for Django

##CSS Framework
We're using foundation, via SCSS, so to install, follow the instructions here:

http://foundation.zurb.com/docs/sass.html

From Operis root:

gem install zurb-foundation
gem install compass
compass create static -r zurb-foundation --using foundation --force

Then to keep up with modifications, you can run (in a separate CLI):
compass watch

##Upcoming Integrations
https://github.com/marcgibbons/django-rest-swagger