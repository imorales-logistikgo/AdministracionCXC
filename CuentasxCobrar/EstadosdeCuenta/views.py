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
	Folios = list()
	for Factura in result:
		FoliosCobro= ""
		for Cobro in RelacionCobrosFacturasxCliente.objects.filter(IDFactura = Factura.IDFactura):
			FoliosCobro += Cobro.IDCobro.Folio + ", "
		FoliosCobro = FoliosCobro[:-2]
		Folios.append(FoliosCobro)
	ContadoresPendientes = len(list(FacturasPendiente))
	ContadoresAbonadas = len(list(FacturasAbonada))
	return render(request, 'EstadosdeCuenta.html', {'Facturas': result, 'Folios': Folios, 'ContadoresPendientes': ContadoresPendientes, 'ContadoresAbonadas': ContadoresAbonadas})



def GetFacturasByFilters(request):
	FechaDescargaDesde = request.GET["FechaDescargaDesde"]
	FechaDescargaHasta = request.GET["FechaDescargaHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	Status = json.loads(request.GET["Status"])
	Moneda = json.loads(request.GET["Moneda"])
	Facturas = View_FacturasxCliente.objects.filter(FechaFactura__range = [datetime.datetime.strptime(FechaDescargaDesde,'%m/%d/%Y'), datetime.datetime.strptime(FechaDescargaHasta,'%m/%d/%Y')])
	if Status:
		Facturas = Facturas.filter(Status__in = Status)
	if Clientes:
		Facturas = Facturas.filter(NombreCortoCliente__in = Clientes)
	if Moneda:
		Facturas = Facturas.filter(Moneda__in = Moneda)
	Folios = list()
	for Factura in Facturas:
		FoliosCobro= ""
		for Cobro in RelacionCobrosFacturasxCliente.objects.filter(IDFactura = Factura.IDFactura):
			FoliosCobro += Cobro.IDCobro.Folio + ", "
		FoliosCobro = FoliosCobro[:-2]
		Folios.append(FoliosCobro)
	htmlRes = render_to_string('TablaEstadosCuenta.html', {'Facturas':Facturas, 'Folios': Folios}, request = request,)
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
