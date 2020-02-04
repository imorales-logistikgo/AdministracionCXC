from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC, FacturasxCliente, Partida, RelacionFacturaxPartidas, PendientesEnviar, Ext_PendienteEnviar_Precio
from usersadmon.models import Cliente, AdmonUsuarios, AdmonClientes_Facturacion
from django.core import serializers
from .forms import FacturaForm
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
@login_required


def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1 AND IsFacturaCliente = 0", ['FINALIZADO'])
	ContadorTodos, ContadorPendientes, ContadorFinalizados, ContadorConEvidencias, ContadorSinEvidencias = GetContadores()
	Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
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
	Proyectos = json.loads(request.GET["Proyecto"])
	Moneda = request.GET["Moneda"]
	PendingToSend = View_PendientesEnviarCxC.objects.filter(FechaDescarga__range = [datetime.datetime.strptime(request.GET["FechaDescargaDesde"],'%m/%d/%Y'), datetime.datetime.strptime(request.GET["FechaDescargaHasta"],'%m/%d/%Y')], IsFacturaCliente = False)
	if Status:
		if "Con evidencias" in Status:
			PendingToSend = PendingToSend.filter(IsEvidenciaDigital = True, IsEvidenciaFisica = True)
			if len(Status) > 1:
				PendingToSend = PendingToSend.filter(Status__in = Status)
		else:
			PendingToSend = PendingToSend.filter(Status__in = Status)
	if Clientes:
		PendingToSend = PendingToSend.filter(IDCliente__in = Clientes)
	if Proyectos:
		PendingToSend = PendingToSend.filter(Proyecto__in = Proyectos)
	PendingToSend = PendingToSend.filter(Moneda = Moneda)
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendingToSend}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def SaveFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	newFactura = FacturasxCliente()
	newFactura.Folio = jParams["FolioFactura"]
	newFactura.NombreCortoCliente = jParams["Cliente"]
	newFactura.IDCliente = jParams["IDCliente"]
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
		print(IDPendiente)
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


def CheckFolioDuplicado(request):
	IsDuplicated = FacturasxCliente.objects.filter(Folio = request.GET["Folio"]).exclude(Status = "CANCELADA").exists()
	return JsonResponse({'IsDuplicated' : IsDuplicated})
