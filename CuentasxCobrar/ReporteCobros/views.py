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
	#Moneda = json.loads(request.GET["Moneda"])
	if not Clientes:
		Cobros = RelacionCobrosFacturasxCliente.objects.all()
	else:
		Cobros = RelacionCobrosFacturasxCliente.objects.filter(IDCobro__NombreCortoCliente__in = Clientes)
	# if Moneda:
	# 	Cobros = Cobros.filter(Moneda__in = Moneda)
	Cobros = Cobros.filter(IDCobro__FechaCobro__range = [datetime.datetime.strptime(FechaCobroDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaCobroHasta,'%m/%d/%Y')])
	htmlRes = render_to_string('TablaReporteCobros.html', {'Cobros':Cobros}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})