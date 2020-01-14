from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import RelacionFacturaxPartidas, RelacionConceptoxProyecto
from EstadosdeCuenta.models import FacturasxCliente
from usersadmon.models import Cliente
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
@login_required

def ReporteCanceladas(request):
	Canceladas = FacturasxCliente.objects.filter(Status = 'Cancelada')
	listFacturas = list()
	for Cancelada in Canceladas:
		Factura = {}
		conFacturaxPartidas= RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = Cancelada.IDFactura).select_related("IDPendienteEnviar")
		Factura['Folio'] = Cancelada.Folio
		Factura['Cliente'] = Cancelada.NombreCortoCliente
		Factura['FechaFactura'] = Cancelada.FechaFactura
		if conFacturaxPartidas.exists():
			Factura['FechaBaja'] = list(conFacturaxPartidas)[0].IDPartida.FechaBaja
		Factura['Total'] = Cancelada.Total
		Factura['Viajes'] = ''
		for PENDIENTE in conFacturaxPartidas:
			Factura['Viajes'] += PENDIENTE.IDPendienteEnviar.Folio + ", "
		Factura['Viajes'] = Factura['Viajes'][:-2]
		listFacturas.append(Factura)
	Clientes = Cliente.objects.all()
	return render(request, 'ReporteCanceladas.html', {'Facturas': listFacturas, 'Clientes': Clientes})



def GetCanceladasByFilters(request):
	FechaFacturaDesde = request.GET["FechaFacturaDesde"]
	FechaFacturaHasta = request.GET["FechaFacturaHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	Moneda = json.loads(request.GET["Moneda"])
	if not Clientes:
		Canceladas = FacturasxCliente.objects.filter(Status = 'Cancelada')
	else:
		Canceladas = FacturasxCliente.objects.filter(Status = 'Cancelada', NombreCortoCliente__in = Clientes)
	if Moneda:
		Canceladas = Canceladas.filter(Moneda__in = Moneda)
	Canceladas = Canceladas.filter(FechaFactura__range = [datetime.datetime.strptime(FechaFacturaDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaFacturaHasta,'%m/%d/%Y')])
	listFacturas = list()
	for Cancelada in Canceladas:
		Factura = {}
		conFacturaxPartidas= RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = Cancelada.IDFactura)
		Factura['Folio'] = Cancelada.Folio
		Factura['Cliente'] = Cancelada.NombreCortoCliente
		Factura['FechaFactura'] = Cancelada.FechaFactura
		Factura['FechaBaja'] = list(conFacturaxPartidas)[0].IDPartida.FechaBaja
		Factura['Total'] = Cancelada.Total
		Factura['Viajes'] = ''
		for PENDIENTE in conFacturaxPartidas:
			Factura['Viajes'] += PENDIENTE.IDPendienteEnviar.Folio + ", "
		Factura['Viajes'] = Factura['Viajes'][:-2]
		listFacturas.append(Factura)
	htmlRes = render_to_string('TablaReporteCanceladas.html', {'Facturas':listFacturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
