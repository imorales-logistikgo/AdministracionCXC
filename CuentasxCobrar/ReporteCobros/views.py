from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from EstadosdeCuenta.models import CobrosxCliente, CobrosxFacturas, RelacionCobrosFacturasxCliente
from usersadmon.models import Cliente, AdmonUsuarios
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db import transaction
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
	Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
	return render(request, 'ReporteCobros.html', {'Cobros': Cobros, 'Clientes': Clientes, "Folios": Folios})



def GetCobrosByFilters(request):
	FechaCobroDesde = request.GET["FechaCobroDesde"]
	FechaCobroHasta = request.GET["FechaCobroHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	if not Clientes:
		Cobros = CobrosxCliente.objects.all()
	else:
		Cobros = CobrosxCliente.objects.filter(IDCliente__in = Clientes)
	Cobros = Cobros.filter(FechaCobro__range = [datetime.datetime.strptime(FechaCobroDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaCobroHasta,'%m/%d/%Y')])
	Folios = list()
	for Cobro in Cobros:
		FoliosFactura = ""
		for Factura in RelacionCobrosFacturasxCliente.objects.filter(IDCobro = Cobro.IDCobro).select_related('IDFactura'):
			FoliosFactura += Factura.IDFactura.Folio + ", "
		FoliosFactura = FoliosFactura[:-2]
		Folios.append(FoliosFactura)
	htmlRes = render_to_string('TablaReporteCobros.html', {'Cobros':Cobros, "Folios": Folios}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def CancelarCobro(request):
	try:
		with transaction.atomic(using='users'):
			IDCobro = json.loads(request.body.decode('utf-8'))["IDCobro"]
			for Factura in RelacionCobrosFacturasxCliente.objects.filter(IDCobro = IDCobro).select_related('IDFactura'):
				Factura.IDFactura.Saldo += Factura.IDCobroxFactura.Total
				if Factura.IDFactura.Saldo == Factura.IDFactura.Total:
					Factura.IDFactura.Status = "PENDIENTE"
				else:
					Factura.IDFactura.Status = "ABONADA"
				Factura.IDFactura.save()
			Cobro = CobrosxCliente.objects.get(IDCobro = IDCobro)
			Cobro.Status = "CANCELADA"
			Cobro.IDUsuarioBaja =  request.user.idusuario
			Cobro.FechaBaja = datetime.datetime.now()
			Cobro.save()
			return HttpResponse(status=200)
	except:
		transaction.rollback(using='users')
		return HttpResponse(status=400)




def GetDetallesCobro(request):
	IDCobro = request.GET["IDCobro"]
	FacturasxCobro = RelacionCobrosFacturasxCliente.objects.filter(IDCobro = IDCobro).select_related('IDFactura').select_related('IDCobroxFactura')
	Facturas = list()
	for FacturaxCobro in FacturasxCobro:
		Cobro = {}
		Cobro["FolioFactura"] = FacturaxCobro.IDFactura.Folio
		Cobro["FechaFactura"] = FacturaxCobro.IDFactura.FechaFactura
		Cobro["Total"] = FacturaxCobro.IDCobroxFactura.Total
		Facturas.append(Cobro)
	htmlRes = render_to_string('TablaDetallesReporteCobro.html', {'Facturas':Facturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
