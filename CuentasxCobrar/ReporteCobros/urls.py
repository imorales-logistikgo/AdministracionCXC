from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReporteCobros, name='ReporteCobros'),
    path('FilterBy', views.GetCobrosByFilters, name='GetCobrosByFilters'),
    path('GetDetallesCobro', views.GetDetallesCobro, name='GetDetallesCobro'),
    path('CancelarCobro', views.CancelarCobro, name='CancelarCobro'),
]
