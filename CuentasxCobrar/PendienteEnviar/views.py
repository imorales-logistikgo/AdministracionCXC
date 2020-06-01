from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC, FacturasxCliente, Partida, RelacionFacturaxPartidas, PendientesEnviar, Ext_PendienteEnviar_Precio, RelacionConceptoxProyecto
from usersadmon.models import Cliente, AdmonUsuarios
from bkg_viajes.models import Bro_Viajes
from XD_Viajes.models import XD_Viajes
from django.core import serializers
from .forms import FacturaForm
from django.template.loader import render_to_string
import json, datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
import math
from decimal import *
import hashlib
@login_required


def GetPendientesEnviar(request):
	#PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1 AND IsFacturaCliente = 0 AND Moneda = %s", ['FINALIZADO','MXN'])
	PendingToSend = View_PendientesEnviarCxC.objects.filter(IsEvidenciaDigital = True, IsEvidenciaFisica__in = (True, False), IsFacturaCliente = False, Status__in = ["FINALIZADO", "COMPLETO", "ENTREGADO"], FechaDescarga__month = datetime.datetime.now().month, FechaDescarga__year = datetime.datetime.now().year)
	ContadorTodos, ContadorPendientes, ContadorFinalizados, ContadorConEvidencias, ContadorSinEvidencias = GetContadores()
	Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend,'Clientes': Clientes, 'contadorPendientes': ContadorPendientes, 'contadorFinalizados': ContadorFinalizados, 'contadorConEvidencias': ContadorConEvidencias, 'contadorSinEvidencias': ContadorSinEvidencias})

def truncate(n, decimals=0):
    multiplier = 10 ** decimals
    return int(n * multiplier) / multiplier

def GetContadores():
	AllPending = list(View_PendientesEnviarCxC.objects.values("IsFacturaCliente", "Status", "IsEvidenciaDigital", "IsEvidenciaFisica").all())
	ContadorTodos = len(list(filter(lambda x: x["IsFacturaCliente"] == False, AllPending)))
	ContadorPendientes = len(list(filter(lambda x: x["Status"] == "PENDIENTE", AllPending)))
	ContadorFinalizados = len(list(filter(lambda x: x["Status"] == "FINALIZADO", AllPending)))
	ContadorConEvidencias = len(list(filter(lambda x: x["IsEvidenciaFisica"] == True and x["IsEvidenciaDigital"] == True and x["IsFacturaCliente"] == False, AllPending)))
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
	newFactura.FechaAlta = datetime.datetime.now()
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
	newFactura.Reajuste = jParams["Reajuste"]
	newFactura.save()
	return HttpResponse(newFactura.IDFactura)



def SavePartidasxFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	print(jParams["arrParcial"])
	if len(jParams["arrParcial"]) is 0:
		print("yes")
		for IDPendiente in jParams["arrPendientes"]:
			Viaje = View_PendientesEnviarCxC.objects.get(IDPendienteEnviar = IDPendiente)
			newPartida = Partida()
			newPartida.FechaAlta = datetime.datetime.now()
			newPartida.Subtotal = (((0 if(Viaje.ServiciosSubtotal is None) else Viaje.ServiciosSubtotal) if (jParams["IsFacturaServicios"]) else Viaje.Subtotal)) if (Viaje.IsFacturaParcial is None or Viaje.IsFacturaParcial==False) else Viaje.BalanceSubTotal
			newPartida.IVA = (((0 if (Viaje.ServiciosIVA is None) else Viaje.ServiciosIVA) if (jParams["IsFacturaServicios"]) else Viaje.IVA)) if (Viaje.IsFacturaParcial is None or Viaje.IsFacturaParcial==False) else Viaje.BalanceIva
			newPartida.Retencion = (((0 if(Viaje.ServiciosRetencion is None) else Viaje.ServiciosRetencion) if (jParams["IsFacturaServicios"]) else Viaje.Retencion)) if (Viaje.IsFacturaParcial is None or Viaje.IsFacturaParcial==False) else Viaje.BalanceRetencion
			newPartida.Total = (((0 if (Viaje.ServiciosTotal is None) else Viaje.ServiciosTotal) if (jParams["IsFacturaServicios"]) else Viaje.Total)) if (Viaje.IsFacturaParcial is None or Viaje.IsFacturaParcial==False) else Viaje.BalanceTotal
			partidaReajuste = FacturasxCliente.objects.get(IDFactura = jParams["IDFactura"])
			if Viaje.IDPendienteEnviar == jParams["IDFolioReajuste"]:
				newPartida.Reajuste = partidaReajuste.Reajuste
				if Viaje.Proyecto == 'BKG':
					SaveReajusteBkg(Viaje.IDPendienteEnviar, partidaReajuste.Reajuste)
				elif Viaje.Proyecto == 'XD':
					SaveReajusteXD(Viaje.IDPendienteEnviar, partidaReajuste.Reajuste)
			else:
				newPartida.Reajuste = 0
			newPartida.save()
			newRelacionFacturaxPartida = RelacionFacturaxPartidas()
			newRelacionFacturaxPartida.IDFacturaxCliente = FacturasxCliente.objects.get(IDFactura = jParams["IDFactura"])
			newRelacionFacturaxPartida.IDPartida = newPartida
			newRelacionFacturaxPartida.IDPendienteEnviar = PendientesEnviar.objects.get(IDPendienteEnviar = IDPendiente)
			newRelacionFacturaxPartida.save()
			Ext_Precio = Ext_PendienteEnviar_Precio.objects.get(IDPendienteEnviar = IDPendiente)
			Ext_Precio.BalanceSubTotal=0
			Ext_Precio.BalanceIva=0
			Ext_Precio.BalanceRetencion=0
			Ext_Precio.BalanceTotal=0
			Ext_Precio.IsFacturaCliente = True
			Ext_Precio.save()
	else:
		print("not")
		for IDPen in jParams["arrPendientes"]:
			folioPendiente=Ext_PendienteEnviar_Precio.objects.get(IDPendienteEnviar = IDPen)
			for parcial in jParams["arrParcial"]:
				if IDPen==parcial["IDViaje"]:
					subtotalParcial=float(parcial["Subtotal"])
					ivaParcial=float(parcial["iva"])
					retencionParcial=float(parcial["retencion"])
					totalParcial=float(parcial["total"])
					print(folioPendiente.IsFacturaParcial)
					if(folioPendiente.IsFacturaParcial is None or folioPendiente.IsFacturaParcial==False):
						print("factura normal")
						partidaP=Partida()
						partidaP.FechaAlta=datetime.datetime.now()
						print(truncate(folioPendiente.PrecioSubtotal,2))
						print(subtotalParcial)
						partidaP.Subtotal=folioPendiente.PrecioSubtotal if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else subtotalParcial
						partidaP.IVA=folioPendiente.PrecioIVA if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else ivaParcial
						partidaP.Retencion=folioPendiente.PrecioRetencion if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else retencionParcial
						partidaP.Total=folioPendiente.PrecioTotal if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else (subtotalParcial+ivaParcial)-retencionParcial
						partidaP.save()
						newRelacionFacturaParcial=RelacionFacturaxPartidas()
						newRelacionFacturaParcial.IDFacturaxCliente=FacturasxCliente.objects.get(IDFactura=jParams["IDFactura"])
						newRelacionFacturaParcial.IDPartida=partidaP
						newRelacionFacturaParcial.IDPendienteEnviar=PendientesEnviar.objects.get(IDPendienteEnviar=parcial["IDViaje"])
						newRelacionFacturaParcial.save()
						folioPendiente.IsFacturaCliente=True if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else False
						folioPendiente.IsFacturaParcial=False if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else True
						folioPendiente.BalanceSubTotal=0 if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else truncate(folioPendiente.PrecioSubtotal,2)-subtotalParcial
						folioPendiente.BalanceIva=0 if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else truncate(folioPendiente.PrecioIVA,2)-ivaParcial
						folioPendiente.BalanceRetencion=0 if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2) else truncate(folioPendiente.PrecioRetencion,2)-retencionParcial
						folioPendiente.BalanceTotal=0 if subtotalParcial==truncate(folioPendiente.PrecioSubtotal,2)else truncate(folioPendiente.PrecioTotal,2)-((subtotalParcial+ivaParcial)-retencionParcial)
						folioPendiente.save()
					else:
						print(folioPendiente)
						print("factura ya parcial")
						print(truncate(folioPendiente.BalanceSubTotal,2))
						print(float(subtotalParcial))
						partidaParcial=Partida()
						partidaParcial.FechaAlta=datetime.datetime.now()
						partidaParcial.Subtotal=folioPendiente.BalanceSubTotal if subtotalParcial==float(folioPendiente.BalanceSubTotal) else subtotalParcial
						partidaParcial.IVA=folioPendiente.BalanceIva if subtotalParcial==float(folioPendiente.BalanceSubTotal) else ivaParcial
						partidaParcial.Retencion=folioPendiente.BalanceRetencion if subtotalParcial==float(folioPendiente.BalanceSubTotal) else retencionParcial
						partidaParcial.Total=folioPendiente.BalanceTotal if subtotalParcial==float(folioPendiente.BalanceSubTotal) else (subtotalParcial+ivaParcial)-retencionParcial
						partidaParcial.save()
						newRelacionFacParcial=RelacionFacturaxPartidas()
						newRelacionFacParcial.IDFacturaxCliente=FacturasxCliente.objects.get(IDFactura=jParams["IDFactura"])
						newRelacionFacParcial.IDPartida=partidaParcial
						newRelacionFacParcial.IDPendienteEnviar=PendientesEnviar.objects.get(IDPendienteEnviar=parcial["IDViaje"])
						newRelacionFacParcial.save()
						folioPendiente.IsFacturaCliente=True if subtotalParcial==float(folioPendiente.BalanceSubTotal) else False
						folioPendiente.BalanceSubTotal=0 if subtotalParcial==float(folioPendiente.BalanceSubTotal) else float(folioPendiente.BalanceSubTotal)-subtotalParcial
						folioPendiente.BalanceIva=0 if subtotalParcial==float(folioPendiente.BalanceSubTotal) else float(folioPendiente.BalanceIva)-ivaParcial
						folioPendiente.BalanceRetencion=0 if subtotalParcial==float(folioPendiente.BalanceSubTotal) else float(folioPendiente.BalanceRetencion)-retencionParcial
						folioPendiente.BalanceTotal=0 if subtotalParcial==float(folioPendiente.BalanceSubTotal)else float(folioPendiente.BalanceTotal)-(subtotalParcial+ivaParcial)-retencionParcial
						folioPendiente.save()

	PendingToSend = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND IsEvidenciaDigital = 1 AND IsEvidenciaFisica = 1", ['FINALIZADO'])
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendingToSend}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})


def SaveReajusteBkg(IDPEe, reajuste):
	IDConceptoPE = RelacionConceptoxProyecto.objects.get(IDPendienteEnviar = IDPEe)
	if Bro_Viajes.objects.filter(IDBro_Viaje = IDConceptoPE.IDConcepto).exists():
		IDBkg = Bro_Viajes.objects.get(IDBro_Viaje = IDConceptoPE.IDConcepto)
		newTotalBkg = Decimal.from_float(IDBkg.PrecioTotal) + reajuste
		IDBkg.PrecioTotal = round(newTotalBkg, 2)
		IDBkg.save()
	else:
		pass
	return HttpResponse("")

def SaveReajusteXD(IDPEe, reajusteXD):
	IDConceptoPE = RelacionConceptoxProyecto.objects.get(IDPendienteEnviar = IDPEe)
	if XD_Viajes.objects.filter(XD_IDViaje = IDConceptoPE.IDConcepto).exists():
		IDXD = XD_Viajes.objects.get(XD_IDViaje = IDConceptoPE.IDConcepto)
		newTotalXD = Decimal.from_float(IDXD.PrecioTotal) + reajusteXD
		IDXD.PrecioTotal = round(newTotalXD, 2)
		IDXD.save()
	else:
		pass
	return HttpResponse("")


def CheckFolioDuplicado(request):
	IsDuplicated = FacturasxCliente.objects.filter(Folio = request.GET["Folio"]).exclude(Status = "CANCELADA").exists()
	return JsonResponse({'IsDuplicated' : IsDuplicated})

def CheckHasFactura(request):
	Folios = json.loads(request.GET["Folio"])
	HasFactura = View_PendientesEnviarCxC.objects.filter(IDPendienteEnviar__in = Folios).values_list("IsFacturaCliente", flat=True)
	if True in HasFactura:
		Resp = True
	else:
		Resp = False
	return JsonResponse({'Resp': Resp})

def UpdatePartidas(request):
	h = hashlib.new("sha512", b"Lgk123456*$")
	string = h.hexdigest()
	#bkg =  Bro_Viajes.objects.get(IDBro_Viaje = 23018)
	#print(bkg.PrecioTotal)
#	idF = 185,187,189,191,193,195,197,198,202,211,212,215,217,219,221,256,261,263,267,284,288,407,432,435,441,444,445,447,592,594,595,598
	#idF = 181,183
	#FacturasFragmentadas = FacturasxCliente.objects.filter(IDFactura__in = idF).values_list("IDFactura")
#	Relacion = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente__in = idF).values("IDPendienteEnviar", "IDPartida")
#	for r in Relacion:
#		PendientesEnviar_ = View_PendientesEnviarCxC.objects.get(IDPendienteEnviar = r["IDPendienteEnviar"])
#		Partida_ = Partida.objects.get(IDPartida = r["IDPartida"])
#		if Partida_:
#			Partida_.SubTotal = PendientesEnviar_.ServiciosSubtotal
#			Partida_.IVA = PendientesEnviar_.ServiciosIVA
#			Partida_.Retencion = PendientesEnviar_.ServiciosRetencion
#			Partida_.Total = PendientesEnviar_.ServiciosTotal
#			Partida_.save()
	return HttpResponse("")
