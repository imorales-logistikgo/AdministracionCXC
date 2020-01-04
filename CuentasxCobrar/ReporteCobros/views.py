from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from EstadosdeCuenta.models import CobrosxCliente, CobrosxFacturas, RelacionCobrosFacturasxCliente
from usersadmon.models import Cliente
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
@login_required

def ReporteCobros(request):
	Cobros = CobrosxCliente.objects.all()
	Folios = list()
	for Cobro in Cobros:
		FoliosFactura = ""
		for Factura in RelacionCobrosFacturasxCliente.objects.filter(IDCobro = Cobro.IDCobro).select_related('IDFactura'):
			FoliosFactura += Factura.IDFactura.Folio + ", "
		FoliosFactura = FoliosFactura[:-2]
		Folios.append(FoliosFactura)
	Clientes = Cliente.objects.all()
	return render(request, 'ReporteCobros.html', {'Cobros': Cobros, 'Clientes': Clientes, "Folios": Folios})



def GetCobrosByFilters(request):
	FechaCobroDesde = request.GET["FechaCobroDesde"]
	FechaCobroHasta = request.GET["FechaCobroHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	if not Clientes:
		Cobros = CobrosxCliente.objects.all()
	else:
		Cobros = CobrosxCliente.objects.filter(IDCobro__NombreCortoCliente__in = Clientes)
	Cobros = Cobros.filter(IDCobro__FechaCobro__range = [datetime.datetime.strptime(FechaCobroDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaCobroHasta,'%m/%d/%Y')])
	htmlRes = render_to_string('TablaReporteCobros.html', {'Cobros':Cobros}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
