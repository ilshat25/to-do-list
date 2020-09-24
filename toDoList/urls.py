from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('items/', include('items.urls', namespace='items')),
    path('accounts/', include('accounts.urls')),
    # path('accounts/', include('allauth.urls')),
]
