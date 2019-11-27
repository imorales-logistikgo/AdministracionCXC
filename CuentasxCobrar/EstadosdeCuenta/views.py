from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from EstadosdeCuenta.models import RelacionFacturaxPartidas, View_FacturasxCliente, FacturasxCliente, PendientesEnviar, RelacionConceptoxProyecto, CobrosxCliente, CobrosxFacturas, RelacionCobrosFacturasxCliente
from django.template.loader import render_to_string
from decimal import Decimal
import json, datetime


def EstadosdeCuenta(request):
	FacturasPendiente = View_FacturasxCliente.objects.filter(Status = "Pendiente")
	FacturasAbonada = View_FacturasxCliente.objects.filter(Status = "Abonada")
	result = FacturasPendiente | FacturasAbonada
	return render(request, 'EstadosdeCuenta.html', {'Facturas': result})


def GetFacturasByFilters(request):
	FechaDescargaDesde = request.GET["FechaDescargaDesde"]
	FechaDescargaHasta = request.GET["FechaDescargaHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	Status = json.loads(request.GET["Status"])
	if not Status:
		QueryStatus = ""
	else:
		QueryStatus = "Status IN ({}) AND ".format(','.join(['%s' for _ in range(len(Status))]))
	if not Clientes:
		QueryClientes = ""
	else:
		QueryClientes = "Cliente IN ({}) AND ".format(','.join(['%s' for _ in range(len(Clientes))]))
	QueryFecha = "FechaFactura BETWEEN %s AND %s AND "
	FinalQuery = "SELECT * FROM View_FacturasxCliente WHERE " + QueryStatus + QueryClientes + QueryFecha + "IsAutorizada = 0"
	params = Status + Clientes + [FechaDescargaDesde, FechaDescargaHasta]
	Facturas = View_FacturasxCliente.objects.raw(FinalQuery,params)
	htmlRes = render_to_string('TablaEstadosCuenta.html', {'Facturas':Facturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def CancelarFactura(request):
	IDFactura = json.loads(request.body.decode('utf-8'))["IDFactura"]
	conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = IDFactura)
	if conRelacionFacturaxPartidas:
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.Status = 'Cancelada'
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.save()
		for Partida in conRelacionFacturaxPartidas:
			Partida.IDPartida.IsActiva = False
			Partida.IDPartida.FechaBaja = datetime.datetime.now()
			conPendienteEnviar = RelacionConceptoxProyecto.objects.get(IDConcepto = Partida.IDConcepto)
			conPendienteEnviar.IDPendienteEnviar.IsFacturaCliente = False
			conPendienteEnviar.IDPendienteEnviar.save()
			Partida.IDPartida.save()
	return HttpResponse("")



def GetDetallesFactura(request):
	ListaViajes = list()
	IDFactura = request.GET["IDFactura"]
	conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = IDFactura)
	if conRelacionFacturaxPartidas:
		for Partida in conRelacionFacturaxPartidas:
			ListaViajes.append(RelacionConceptoxProyecto.objects.get(IDConcepto = Partida.IDConcepto))
	htmlRes = render_to_string('TablaDetallesFactura.html', {'Pendientes':ListaViajes}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def SaveCobroxCliente(request):
	jParams = json.loads(request.body.decode('utf-8'))
	newCobro = CobrosxCliente()
	newCobro.FechaAlta = datetime.datetime.now()
	newCobro.Folio = jParams["Folio"]
	newCobro.Total = jParams["Total"]
	newCobro.FechaCobro = datetime.datetime.strptime(jParams["FechaCobro"],'%Y/%m/%d')
	newCobro.RutaXML = jParams["RutaXML"]
	newCobro.RutaPDF = jParams["RutaPDF"]
	newCobro.Comentarios = jParams["Comentarios"]
	newCobro.TipoCambio = jParams["TipoCambio"]
	newCobro.NombreCortoCliente = jParams["Cliente"]
	newCobro.save()
	return HttpResponse(newCobro.IDCobro)



def SaveCobroxFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	for Cobro in jParams["arrCobros"]:
		newCobroxFactura = CobrosxFacturas()
		newCobroxFactura.Total = Cobro["Total"]
		newCobroxFactura.FechaAlta = datetime.datetime.now()
		newCobroxFactura.save()
		newRelacionCobroxFactura = RelacionCobrosFacturasxCliente()
		newRelacionCobroxFactura.IDCobro = CobrosxCliente.objects.get(IDCobro = jParams["IDCobro"])
		newRelacionCobroxFactura.IDCobroxFactura = CobrosxFacturas.objects.get(IDCobroxFactura = newCobroxFactura.IDCobroxFactura)
		Factura = FacturasxCliente.objects.get(IDFactura = Cobro["IDFactura"])
		Factura.Saldo -= Decimal(Cobro["Total"])
		newRelacionCobroxFactura.IDFactura = Factura
		newRelacionCobroxFactura.IDUsuarioAlta = 1
		newRelacionCobroxFactura.IDCliente = 1
		if Factura.Saldo == 0:
			Factura.Status = "Cobrada"
		else:
			Factura.Status = "Abonada"
		Factura.save()
		newRelacionCobroxFactura.save()
	return HttpResponse("")
