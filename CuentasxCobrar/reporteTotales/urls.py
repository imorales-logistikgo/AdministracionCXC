from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from . import views

urlpatterns = [
    path("", views.getFacturas, name='reporteTotales'),
    path("getFacturasByFilters", views.getFacturasByFilters, name='getFacturasByFilters'),
    path("getReporteTotales",views.getReporteTotales,name='getReporteTotales'),

]
