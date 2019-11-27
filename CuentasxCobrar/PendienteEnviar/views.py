from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC, FacturasxCliente, Partida, RelacionFacturaxPartidas, PendientesEnviar
from django.core import serializers
from .forms import FacturaForm
from django.template.loader import render_to_string
import json, datetime



def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1 AND IsFacturaCliente = 0", ['Finalizado'])
	ContadorTodos, ContadorPendientes, ContadorFinalizados, ContadorConEvidencias, ContadorSinEvidencias = GetContadores()
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend, 'contadorPendientes': ContadorPendientes, 'contadorFinalizados': ContadorFinalizados, 'contadorConEvidencias': ContadorConEvidencias, 'contadorSinEvidencias': ContadorSinEvidencias})



def GetContadores():
	ContadorTodos = len(list(View_PendientesEnviarCxC.objects.all()))
	ContadorPendientes = len(list(View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", ['Pendiente'])))
	ContadorFinalizados = len(list(View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", ['Finalizado'])))
	ContadorConEvidencias = len(list(View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1")))
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
	FinalQuery = "SELECT * FROM View_PendientesEnviarCxC WHERE " + QueryStatus + QueryClientes + QueryFecha + QueryMoneda
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
	newFactura.save()
	return HttpResponse(newFactura.IDFactura)



def SavePartidasxFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	for IDConcepto in jParams["arrConceptos"]:
		Viaje = View_PendientesEnviarCxC.objects.get(IDConcepto = IDConcepto)
		newPartida = Partida()
		newPartida.FechaAlta = datetime.datetime.now()
		newPartida.Subtotal = Viaje.PrecioSubtotal
		newPartida.IVA = Viaje.PrecioIVA
		newPartida.Retencion = Viaje.PrecioRetencion
		newPartida.Total = Viaje.PrecioTotal
		newPartida.save()
		newRelacionFacturaxPartida = RelacionFacturaxPartidas()
		newRelacionFacturaxPartida.IDFacturaxCliente = FacturasxCliente.objects.get(IDFactura = jParams["IDFactura"])
		newRelacionFacturaxPartida.IDPartida = newPartida
		newRelacionFacturaxPartida.IDConcepto = IDConcepto
		newRelacionFacturaxPartida.IDUsuarioAlta = 1
		newRelacionFacturaxPartida.IDUsuarioBaja = 1
		newRelacionFacturaxPartida.save()
		Viaje.IDPendienteEnviar.IsFacturaCliente = True
		Viaje.IDPendienteEnviar.save()
	PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1", ['Finalizado'])
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendingToSend}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})
