from django.urls import path
from . import views

urlpatterns = [
    path('ReporteCanceladas', views.ReporteCanceladas, name='ReporteCanceladas'),
    path('ReporteCanceladas/FilterBy', views.GetCanceladasByFilters, name='GetCanceladasByFilters'),
]
