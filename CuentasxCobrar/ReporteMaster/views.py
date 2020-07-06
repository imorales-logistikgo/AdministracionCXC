from django.shortcuts import render
from ReporteMaster.models import View_Master_Cliente
from usersadmon.models import Cliente, AdmonUsuarios
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
import json, datetime

def GetReporteMaster(request):
	MasterReporte = View_Master_Cliente.objects.filter(FechaDescarga__month = datetime.datetime.now().month, FechaDescarga__year = datetime.datetime.now().year)
	Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
	return render(request, 'ReporteMaster.html', {'MasterReporte':MasterReporte, 'Clientes':Clientes})


def GetFacturasByFilters(request):
	Clientes = json.loads(request.GET["Cliente"])
	Moneda = json.loads(request.GET["Moneda"])
	Status = json.loads(request.GET["Status"])
	Proyectos = json.loads(request.GET["Proyecto"])
	Facturas = View_Master_Cliente.objects.filter(FechaDescarga__range = [datetime.datetime.strptime(request.GET["FechaFacturaDesde"],'%m/%d/%Y'), datetime.datetime.strptime(request.GET["FechaFacturaHasta"],'%m/%d/%Y')])
	if Clientes:
		Facturas = Facturas.filter(IDCliente__in = Clientes)
	if Moneda:
		Facturas = Facturas.filter(Moneda__in = Moneda)
	if Status:
		Facturas = Facturas.filter(Status__in = Status)
	if Proyectos:
		Facturas = Facturas.filter(Proyecto__in = Proyectos)
	ListData = PEToList(Facturas)
	htmlRes = render_to_string('TablaReporteMaster.html', {'MasterReporte':ListData}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})


def PEToList(Facturas):
	ListData = list()
	for Fact in Facturas:
		Reporte = {}
		Reporte["Folio"] = Fact.Folio
		Reporte["NombreCortoCliente"] = Fact.NombreCortoCliente
		Reporte["FechaDescarga"] = Fact.FechaDescarga
		Reporte["Moneda"] = Fact.Moneda
		Reporte["Status"] = Fact.Status
		Reporte["IsEvidenciaDigital"] = Fact.IsEvidenciaDigital
		Reporte["IsEvidenciaFisica"] = Fact.IsEvidenciaFisica
		Reporte["Proyecto"] = Fact.Proyecto
		Reporte["TipoConcepto"] = Fact.TipoConcepto
		Reporte["PrecioSubtotal"] = Fact.PrecioSubtotal
		Reporte["PrecioIVA"] = Fact.PrecioIVA
		Reporte["PrecioRetencion"] = Fact.PrecioRetencion
		Reporte["PrecioTotal"] = Fact.PrecioTotal
		Reporte["IsFacturaCliente"] = Fact.IsFacturaCliente
		Reporte["FolioFactCliente"] = Fact.FolioFactCliente
		Reporte["SubtotalFactura"] = Fact.SubtotalFactura
		Reporte["IvaFactura"] = Fact.IvaFactura
		Reporte["RetencionFactura"] = Fact.RetencionFactura
		Reporte["TotalFactura"] = Fact.TotalFactura
		Reporte["StatusFacCliente"] = Fact.StatusFacCliente
		ListData.append(Reporte)
	return ListData
