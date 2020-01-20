from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import RelacionFacturaxPartidas, RelacionConceptoxProyecto, FacturasxCliente
from usersadmon.models import Cliente
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
@login_required

def ReporteCanceladas(request):
	Canceladas = FacturasxCliente.objects.filter(Status = 'CANCELADA')
	listFacturas = list()
	for CANCELADA in Canceladas:
		Factura = {}
		conFacturaxPartidas= RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = CANCELADA.IDFactura).select_related("IDPendienteEnviar")
		Factura['Folio'] = CANCELADA.Folio
		Factura['Cliente'] = CANCELADA.NombreCortoCliente
		Factura['FechaFactura'] = CANCELADA.FechaFactura
		if conFacturaxPartidas.exists():
			Factura['FechaBaja'] = list(conFacturaxPartidas)[0].IDPartida.FechaBaja
		Factura['Total'] = CANCELADA.Total
		Factura['Viajes'] = ''
		for PENDIENTE in conFacturaxPartidas:
			Factura['Viajes'] += PENDIENTE.IDPendienteEnviar.Folio + ", "
		Factura['Viajes'] = Factura['Viajes'][:-2]
		listFacturas.append(Factura)
	Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
	return render(request, 'ReporteCanceladas.html', {'Facturas': listFacturas, 'Clientes': Clientes})



def GetCanceladasByFilters(request):
	FechaFacturaDesde = request.GET["FechaFacturaDesde"]
	FechaFacturaHasta = request.GET["FechaFacturaHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	Moneda = json.loads(request.GET["Moneda"])
	if not Clientes:
		Canceladas = FacturasxCliente.objects.filter(Status = 'CANCELADA')
	else:
		Canceladas = FacturasxCliente.objects.filter(Status = 'CANCELADA', NombreCortoCliente__in = Clientes)
	if Moneda:
		Canceladas = Canceladas.filter(Moneda__in = Moneda)
	Canceladas = Canceladas.filter(FechaFactura__range = [datetime.datetime.strptime(FechaFacturaDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaFacturaHasta,'%m/%d/%Y')])
	listFacturas = list()
	for CANCELADA in Canceladas:
		Factura = {}
		conFacturaxPartidas= RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = CANCELADA.IDFactura)
		Factura['Folio'] = CANCELADA.Folio
		Factura['Cliente'] = CANCELADA.NombreCortoCliente
		Factura['FechaFactura'] = CANCELADA.FechaFactura
		Factura['FechaBaja'] = list(conFacturaxPartidas)[0].IDPartida.FechaBaja
		Factura['Total'] = CANCELADA.Total
		Factura['Viajes'] = ''
		for PENDIENTE in conFacturaxPartidas:
			Factura['Viajes'] += PENDIENTE.IDPendienteEnviar.Folio + ", "
		Factura['Viajes'] = Factura['Viajes'][:-2]
		listFacturas.append(Factura)
	htmlRes = render_to_string('TablaReporteCanceladas.html', {'Facturas':listFacturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
