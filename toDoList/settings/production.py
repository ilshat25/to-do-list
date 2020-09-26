import dj_database_url

from .base import *


DEBUG = False

ALLOWED_HOSTS = ['ilshat-to-do.herokuapp.com']

DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}
