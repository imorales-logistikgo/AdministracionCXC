from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import RelacionConceptoxProyecto,  PendientesEnviar, Ext_PendienteEnviar_Precio, View_PendientesEnviarCxC, RelacionFacturaxPartidas, FacturasxCliente
from EstadosdeCuenta.models import View_FacturasxCliente, CobrosxCliente, CobrosxFacturas, RelacionCobrosFacturasxCliente
from usersadmon.models import Cliente, AdmonUsuarios
from django.template.loader import render_to_string
from decimal import Decimal
import json, datetime, math
from django.contrib.auth.decorators import login_required
from django.db.models import Q
@login_required

def EstadosdeCuenta(request):
	Facturas = View_FacturasxCliente.objects.filter(Status__in = ("PENDIENTE", "ABONADA"), FechaFactura__month = datetime.datetime.now().month, FechaFactura__year = datetime.datetime.now().year)
	FacturasPendiente = View_FacturasxCliente.objects.filter(Status = "PENDIENTE")
	FacturasAbonada = View_FacturasxCliente.objects.filter(Status = "ABONADA")
	#result = FacturasPendiente | FacturasAbonada
	Folios = list()
	for Factura in Facturas:
		FoliosCobro= ""
		for Cobro in RelacionCobrosFacturasxCliente.objects.filter(IDFactura = Factura.IDFactura).select_related('IDCobro'):
			if Cobro.IDCobro.Status != 'CANCELADA':
				FoliosCobro += Cobro.IDCobro.Folio + ", "
		FoliosCobro = FoliosCobro[:-2]
		Folios.append(FoliosCobro)
	ContadoresPendientes = len(list(FacturasPendiente))
	ContadoresAbonadas = len(list(FacturasAbonada))
	Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
	return render(request,  'EstadosdeCuenta.html', {'Facturas': Facturas, 'Clientes': Clientes, 'Folios': Folios, 'ContadoresPendientes': ContadoresPendientes, 'ContadoresAbonadas': ContadoresAbonadas})



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
		Facturas = Facturas.filter(IDCliente__in = Clientes)
	if Moneda:
		Facturas = Facturas.filter(Moneda__in = Moneda)
	Folios = list()
	for Factura in Facturas:
		FoliosCobro= ""
		for Cobro in RelacionCobrosFacturasxCliente.objects.filter(IDFactura = Factura.IDFactura):
			if Cobro.IDCobro.Status != 'CANCELADA':
				FoliosCobro += Cobro.IDCobro.Folio + ", "
		FoliosCobro = FoliosCobro[:-2]
		Folios.append(FoliosCobro)
	htmlRes = render_to_string('TablaEstadosCuenta.html', {'Facturas':Facturas, 'Folios': Folios}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def CancelarFactura(request):
	IDFactura = json.loads(request.body.decode('utf-8'))["IDFactura"]
	conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = IDFactura)
	if conRelacionFacturaxPartidas:
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.Status = 'CANCELADA'
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.IDUsuarioBaja = AdmonUsuarios.objects.get(idusuario = request.user.idusuario)
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.save()
		for Partida in conRelacionFacturaxPartidas:
			Partida.IDPartida.IsActiva = False
			Partida.IDPartida.FechaBaja = datetime.datetime.now()
			Ext_Precio = Ext_PendienteEnviar_Precio.objects.get(IDPendienteEnviar = Partida.IDPendienteEnviar)
			Ext_Precio.IsFacturaCliente = False
			Ext_Precio.save()
			Partida.IDPartida.save()
	return HttpResponse("")



def GetDetallesFactura(request):
	ListaViajes = list()
	IDFactura = request.GET["IDFactura"]
	conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = IDFactura)
	if conRelacionFacturaxPartidas:
		for Partida in conRelacionFacturaxPartidas:
			ListaViajes.append(View_PendientesEnviarCxC.objects.get(IDPendienteEnviar = Partida.IDPendienteEnviar.IDPendienteEnviar))
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
	newCobro.IDCliente = jParams["IDCliente"]
	newCobro.IDUsuarioAlta = request.user.idusuario
	newCobro.save()
	return HttpResponse(newCobro.IDCobro)




def truncate(number, digits) -> Decimal:
    stepper = 10.0 ** digits
    return math.trunc(stepper * number) / stepper



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
		newRelacionCobroxFactura.IDUsuarioAlta = request.user.idusuario
		if truncate(float(Factura.Saldo), 2) == 0:
			Factura.Status = "COBRADA"
		else:
			Factura.Status = "ABONADA"
		Factura.save()
		newRelacionCobroxFactura.save()
	return HttpResponse("")



def GetDetallesCobro(request):
	IDFactura = json.loads(request.body.decode('utf-8'))["IDFactura"]



def GetDetallesCobro(request):
	IDFactura = request.GET["IDFactura"]
	FacturasxCobro = RelacionCobrosFacturasxCliente.objects.filter(IDFactura = IDFactura).select_related('IDCobro').select_related('IDCobroxFactura')
	Facturas = list()
	for FacturaxCobro in FacturasxCobro:
		Cobro = {}
		Cobro["FolioCobro"] = FacturaxCobro.IDCobro.Folio
		Cobro["FechaCobro"] = FacturaxCobro.IDCobro.FechaCobro
		Cobro["Total"] = FacturaxCobro.IDCobroxFactura.Total
		Facturas.append(Cobro)
	htmlRes = render_to_string('TablaDetallesCobro.html', {'Facturas':Facturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
