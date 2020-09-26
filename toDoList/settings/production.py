import dj_database_url

from .base import *


DEBUG = False

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}
