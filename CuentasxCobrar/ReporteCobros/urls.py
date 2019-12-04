from django.urls import path
from . import views

urlpatterns = [
    path('ReporteCobros', views.ReporteCobros, name='ReporteCobros'),
    path('ReporteCobros/FilterBy', views.GetCobrosByFilters, name='GetCobrosByFilters'),
]
