from importlib import import_module

from django.urls import path

from allauth.socialaccount import providers

from . import views


urlpatterns = [
    path('login/', views.login_view, name='login'),
]

provider_urlpatterns = []
for provider in providers.registry.get_list():
    try:
        prov_mod = import_module(provider.get_package() + '.urls')
    except ImportError:
        continue
    prov_urlpatterns = getattr(prov_mod, 'urlpatterns', None)
    if prov_urlpatterns:
        provider_urlpatterns += prov_urlpatterns
urlpatterns += provider_urlpatterns