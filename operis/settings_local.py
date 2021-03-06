from os.path import dirname, join, abspath
from django.conf import settings

# Django settings for operis project.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'operis',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'amadsen',
        'PASSWORD': '1hsvy5qb',
        'HOST': '192.168.2.107',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}

NODE_ROOT = join(settings.PROJECT_DIR, '..', 'node_modules')
HANDLEBARS_PATH = join(NODE_ROOT, 'django-ember-precompile', 'bin', 'django-ember-precompile')

COMPRESS_PRECOMPILERS = (
    ('text/x-handlebars', '{} {{infile}}'.format(HANDLEBARS_PATH)),
)

REST_FRAMEWORK = {
    #'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    'INITCAP_FIELDS':False,
    'DEFAULT_PAGINATION_SERIALIZER_CLASS':'api.serializers.CustomPaginationSerializer',
    'FILTER_BACKEND': 'api.filters.DjangoFilterBackend',
    'PAGINATE_BY': 3,
    'PAGINATE_BY_PARAM': 'page_size'
}

EMBER_MODELS = ["example.models"]
EMBER_APP_NAME = "ember-app"
EMBER_ENV = '{"environment":"development","baseURL":"/","locationType":"auto","EmberENV":{"FEATURES":{}},"APP":{"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true}}'