from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from EstadosdeCuenta.models import CobrosxCliente, CobrosxFacturas, RelacionCobrosFacturasxCliente
from django.template.loader import render_to_string
import json, datetime

def ReporteCobros(request):
	Cobros = RelacionCobrosFacturasxCliente.objects.all()
	return render(request, 'ReporteCobros.html', {'Cobros': Cobros})



def GetCobrosByFilters(request):
	FechaCobroDesde = request.GET["FechaCobroDesde"]
	FechaCobroHasta = request.GET["FechaCobroHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	if not Clientes:
		Cobros = RelacionCobrosFacturasxCliente.objects.all()
	else:
		Cobros = RelacionCobrosFacturasxCliente.objects.filter(IDCobro__NombreCortoCliente__in = Clientes)
	Cobros = Cobros.filter(IDCobro__FechaCobro__range = [datetime.datetime.strptime(FechaCobroDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaCobroHasta,'%m/%d/%Y')])
	htmlRes = render_to_string('TablaReporteCobros.html', {'Cobros':Cobros}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})