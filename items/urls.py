from django.urls import path

from . import views


app_name = 'items'

urlpatterns = [
    path('add/', views.add_view, name='add'),
    path('done/<int:pk>/', views.done_view, name='done'),
    path('', views.index_view, name='index'),
]