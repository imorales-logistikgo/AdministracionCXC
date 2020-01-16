from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC, FacturasxCliente, Partida, RelacionFacturaxPartidas, PendientesEnviar, Ext_PendienteEnviar_Precio
from usersadmon.models import Cliente, AdmonUsuarios
from django.core import serializers
from .forms import FacturaForm
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
@login_required


def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1 AND IsFacturaCliente = 0", ['FINALIZADO'])
	ContadorTodos, ContadorPendientes, ContadorFinalizados, ContadorConEvidencias, ContadorSinEvidencias = GetContadores()
	Clientes = Cliente.objects.all()
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend, 'Clientes': Clientes, 'contadorPendientes': ContadorPendientes, 'contadorFinalizados': ContadorFinalizados, 'contadorConEvidencias': ContadorConEvidencias, 'contadorSinEvidencias': ContadorSinEvidencias})


def GetContadores():
	AllPending = list(View_PendientesEnviarCxC.objects.values("IsFacturaCliente", "Status", "IsEvidenciaDigital", "IsEvidenciaFisica").all())
	ContadorTodos = len(list(filter(lambda x: x["IsFacturaCliente"] == False, AllPending)))
	ContadorPendientes = len(list(filter(lambda x: x["Status"] == "PENDIENTE", AllPending)))
	ContadorFinalizados = len(list(filter(lambda x: x["Status"] == "FINALIZADO", AllPending)))
	ContadorConEvidencias = len(list(filter(lambda x: x["IsEvidenciaFisica"] == True and x["IsEvidenciaDigital"] == True, AllPending)))
	ContadorSinEvidencias = ContadorTodos - ContadorConEvidencias
	return ContadorTodos, ContadorPendientes, ContadorFinalizados, ContadorConEvidencias, ContadorSinEvidencias


def GetPendientesByFilters(request):
	FechaDescargaDesde = request.GET["FechaDescargaDesde"]
	FechaDescargaHasta = request.GET["FechaDescargaHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	Status = json.loads(request.GET["Status"])
	Moneda = request.GET["Moneda"]
	if not Status:
		QueryStatus = ""
	else:
		QueryStatus = "Status IN ({}) AND ".format(','.join(['%s' for _ in range(len(Status))]))
	if not Clientes:
		QueryClientes = ""
	else:
		QueryClientes = "NombreCliente IN ({}) AND ".format(','.join(['%s' for _ in range(len(Clientes))]))
	QueryFecha = "FechaDescarga BETWEEN %s AND %s AND "
	QueryMoneda = "Moneda = %s "
	FinalQuery = "SELECT * FROM View_PendientesEnviarCxC WHERE " + QueryStatus + QueryClientes + QueryFecha + QueryMoneda + "AND IsFacturaCliente = 0"
	params = Status + Clientes + [FechaDescargaDesde, FechaDescargaHasta] + [Moneda]
	PendingToSend = View_PendientesEnviarCxC.objects.raw(FinalQuery,params)
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendingToSend}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def SaveFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	newFactura = FacturasxCliente()
	newFactura.Folio = jParams["FolioFactura"]
	newFactura.NombreCortoCliente = jParams["Cliente"]
	newFactura.FechaFactura = datetime.datetime.strptime(jParams["FechaFactura"],'%Y/%m/%d')
	newFactura.FechaRevision = datetime.datetime.strptime(jParams["FechaRevision"],'%Y/%m/%d')
	newFactura.FechaVencimiento = datetime.datetime.strptime(jParams["FechaVencimiento"],'%Y/%m/%d')
	newFactura.Moneda = jParams["Moneda"]
	newFactura.Subtotal = jParams["SubTotal"]
	newFactura.IVA = jParams["IVA"]
	newFactura.Total = jParams["Total"]
	newFactura.Saldo = jParams["Total"]
	newFactura.Retencion = jParams["Retencion"]
	newFactura.TipoCambio = jParams["TipoCambio"]
	newFactura.Comentarios = jParams["Comentarios"]
	newFactura.RutaXML = jParams["RutaXML"]
	newFactura.RutaPDF = jParams["RutaPDF"]
	newFactura.IsFragmentada = jParams["IsFragmentada"]
	newFactura.IDUsuarioAlta = AdmonUsuarios.objects.get(idusuario = request.user.idusuario)
	newFactura.save()
	return HttpResponse(newFactura.IDFactura)



def SavePartidasxFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	for IDPendiente in jParams["arrPendientes"]:
		Viaje = View_PendientesEnviarCxC.objects.get(IDPendienteEnviar = IDPendiente)
		newPartida = Partida()
		newPartida.FechaAlta = datetime.datetime.now()
		newPartida.Subtotal = Viaje.Subtotal
		newPartida.IVA = Viaje.IVA
		newPartida.Retencion = Viaje.Retencion
		newPartida.Total = Viaje.Total
		newPartida.save()
		newRelacionFacturaxPartida = RelacionFacturaxPartidas()
		newRelacionFacturaxPartida.IDFacturaxCliente = FacturasxCliente.objects.get(IDFactura = jParams["IDFactura"])
		newRelacionFacturaxPartida.IDPartida = newPartida
		newRelacionFacturaxPartida.IDPendienteEnviar = PendientesEnviar.objects.get(IDPendienteEnviar = IDPendiente)
		newRelacionFacturaxPartida.save()
		Ext_Precio = Ext_PendienteEnviar_Precio.objects.get(IDPendienteEnviar = IDPendiente)
		Ext_Precio.IsFacturaCliente = True
		Ext_Precio.save()
	PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1", ['FINALIZADO'])
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendingToSend}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
