from django.urls import path
from . import views

urlpatterns = [
    path('Indicadores', views.Indicadores, name='Indicadores'),
]
