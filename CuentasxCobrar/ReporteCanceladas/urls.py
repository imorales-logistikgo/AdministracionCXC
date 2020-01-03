from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReporteCanceladas, name='ReporteCanceladas'),
    path('FilterBy', views.GetCanceladasByFilters, name='GetCanceladasByFilters'),
]
