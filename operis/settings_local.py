# Django settings for urbanspace_site project.

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
