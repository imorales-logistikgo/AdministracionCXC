from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from EstadosdeCuenta.models import RelacionFacturaxPartidas, FacturasxCliente, RelacionConceptoxProyecto
from django.template.loader import render_to_string
import json, datetime


def ReporteCanceladas(request):
	Canceladas = FacturasxCliente.objects.filter(Status = 'Cancelada')
	listFacturas = list()
	for Cancelada in Canceladas:
		Factura = {}
		conFacturaxPartidas= RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = Cancelada.IDFactura)
		Factura['Folio'] = Cancelada.Folio
		Factura['Cliente'] = Cancelada.NombreCortoCliente
		Factura['FechaFactura'] = Cancelada.FechaFactura
		Factura['FechaBaja'] = conFacturaxPartidas.first().IDPartida.FechaBaja
		Factura['Total'] = Cancelada.Total
		Factura['Viajes'] = ''
		for Pendiente in conFacturaxPartidas:
			Factura['Viajes'] += RelacionConceptoxProyecto.objects.get(IDConcepto = Pendiente.IDConcepto).IDPendienteEnviar.Folio + ", "
		Factura['Viajes'] = Factura['Viajes'][:-2]
		listFacturas.append(Factura)
	return render(request, 'ReporteCanceladas.html', {'Facturas': listFacturas})



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
		Factura['FechaBaja'] = conFacturaxPartidas.first().IDPartida.FechaBaja
		Factura['Total'] = Cancelada.Total
		Factura['Viajes'] = ''
		for Pendiente in conFacturaxPartidas:
			Factura['Viajes'] += RelacionConceptoxProyecto.objects.get(IDConcepto = Pendiente.IDConcepto).IDPendienteEnviar.Folio + ", "
		Factura['Viajes'] = Factura['Viajes'][:-2]
		listFacturas.append(Factura)
	htmlRes = render_to_string('TablaReporteCanceladas.html', {'Facturas':listFacturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})