from django.urls import path
from . import views

urlpatterns = [
    path('EstadosdeCuenta', views.EstadosdeCuenta, name='EstadosdeCuenta'),
    path('EstadosdeCuenta/FilterBy', views.GetFacturasByFilters, name='FilterBy'),
    path('EstadosdeCuenta/CancelarFactura', views.CancelarFactura, name='CancelarFactura'),
    path('EstadosdeCuenta/GetDetallesFactura', views.GetDetallesFactura, name='GetDetallesFactura'),
    path('EstadosdeCuenta/SaveCobroxCliente', views.SaveCobroxCliente, name='SaveCobroxCliente'),
    path('EstadosdeCuenta/SaveCobroxFactura', views.SaveCobroxFactura, name='SaveCobroxFactura'),
]