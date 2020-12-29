from django.urls import path
from . import views

urlpatterns = [
    path('', views.EstadosdeCuenta, name='EstadosdeCuenta'),
    path('FilterBy', views.GetFacturasByFilters, name='FilterBy'),
    path('CancelarFactura', views.CancelarFactura, name='CancelarFactura'),
    path('GetDetallesFactura', views.GetDetallesFactura, name='GetDetallesFactura'),
    path('SaveCobroxCliente', views.SaveCobroxCliente, name='SaveCobroxCliente'),
    path('SaveCobroxFactura', views.SaveCobroxFactura, name='SaveCobroxFactura'),
    path('GetDetallesCobro', views.GetDetallesCobro, name='GetDetallesCobro'),
    path('GetDatosReajuste', views.GetDatosReajuste, name='GetDatosReajuste'),
    path("GetNotaCreditoByCliente", views.GetNotaCreditoByCliente, name='GetNotaCreditoByCliente')
]