from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
import os
from NotasCredito.models import NotasCredito
from PendienteEnviar.models import RelacionConceptoxProyecto, PendientesEnviar, Ext_PendienteEnviar_Precio, \
    View_PendientesEnviarCxC, RelacionFacturaxPartidas, FacturasxCliente, Partida
from EstadosdeCuenta.models import View_FacturasxCliente, CobrosxCliente, CobrosxFacturas, \
    RelacionCobrosFacturasxCliente, NotaCreditoxFacturas
from XD_Viajes.models import XD_Viajes, RepartosxViaje, XD_AccesoriosxViajes
from bkg_viajes.models import Bro_Viajes, Bro_RepartosxViaje, Bro_ServiciosxViaje, ServiciosBKG
from usersadmon.models import Cliente, AdmonUsuarios
from django.template.loader import render_to_string
from decimal import Decimal
import json, datetime, math
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db import transaction
import pandas as pd
from pandas import ExcelWriter

@login_required
def EstadosdeCuenta(request):
    Facturas = View_FacturasxCliente.objects.filter(Status__in=("PENDIENTE", "ABONADA"),
                                                    FechaFactura__month=datetime.datetime.now().month,
                                                    FechaFactura__year=datetime.datetime.now().year)
    FacturasPendiente = View_FacturasxCliente.objects.filter(Status="PENDIENTE")
    FacturasAbonada = View_FacturasxCliente.objects.filter(Status="ABONADA")
    # result = FacturasPendiente | FacturasAbonada
    Folios = list()
    # for Factura in Facturas:
    # 	FoliosCobro= ""
    # 	for Cobro in RelacionCobrosFacturasxCliente.objects.filter(IDFactura = Factura.IDFactura).select_related('IDCobro'):
    # 		if Cobro.IDCobro.Status != 'CANCELADA':
    # 			FoliosCobro += Cobro.IDCobro.Folio + ", "
    # 	FoliosCobro = FoliosCobro[:-2]
    # 	Folios.append(FoliosCobro)
    ContadoresPendientes = len(list(FacturasPendiente))
    ContadoresAbonadas = len(list(FacturasAbonada))
    Clientes = Cliente.objects.filter(isFiscal=True).exclude(Q(NombreCorto="") | Q(StatusProceso="BAJA"))
    return render(request, 'EstadosdeCuenta.html', {'Facturas': Facturas, 'Clientes': Clientes,
                                                    'ContadoresPendientes': ContadoresPendientes,
                                                    'ContadoresAbonadas': ContadoresAbonadas})


def GetFacturasByFilters(request):
    FechaDescargaDesde = request.GET["FechaDescargaDesde"]
    FechaDescargaHasta = request.GET["FechaDescargaHasta"]
    Clientes = json.loads(request.GET["Cliente"])
    Status = json.loads(request.GET["Status"])
    Moneda = json.loads(request.GET["Moneda"])
    Facturas = View_FacturasxCliente.objects.filter(
        FechaFactura__range=[datetime.datetime.strptime(FechaDescargaDesde, '%m/%d/%Y'),
                             datetime.datetime.strptime(FechaDescargaHasta, '%m/%d/%Y')])
    if Status:
        Facturas = Facturas.filter(Status__in=Status)
    if Clientes:
        Facturas = Facturas.filter(IDCliente__in=Clientes)
    if Moneda:
        Facturas = Facturas.filter(Moneda__in=Moneda)
    Folios = list()
    # for Factura in Facturas:
    # 	FoliosCobro= ""
    # 	for Cobro in RelacionCobrosFacturasxCliente.objects.filter(IDFactura=Factura.IDFactura):
    # 		if Cobro.IDCobro.Status != 'CANCELADA':
    # 			FoliosCobro += Cobro.IDCobro.Folio + ", "
    # 	FoliosCobro = FoliosCobro[:-2]
    # 	Folios.append(FoliosCobro)
    htmlRes = render_to_string('TablaEstadosCuenta.html', {'Facturas': Facturas, }, request=request, )
    return JsonResponse({'htmlRes': htmlRes})


def CancelarFactura(request):
    IDFactura = json.loads(request.body.decode('utf-8'))["IDFactura"]
    Motivo = json.loads(request.body.decode('utf-8'))["MotivoEliminacion"]
    conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente=IDFactura)
    try:
        with transaction.atomic(using='users'):
            if conRelacionFacturaxPartidas:
                for Partida in conRelacionFacturaxPartidas:
                    Partida.IDPartida.IsActiva = False
                    Partida.IDPartida.FechaBaja = datetime.datetime.now()
                    Ext_Precio = Ext_PendienteEnviar_Precio.objects.get(IDPendienteEnviar=Partida.IDPendienteEnviar)
                    Ext_Precio.IsFacturaCliente = False
                    if Ext_Precio.IsFacturaParcial:
                        if CountFacturas(Partida.IDPendienteEnviar) == 1:
                            Ext_Precio.IsFacturaParcial = False
                        Ext_Precio.BalanceSubTotal = 0 if CountFacturas(Partida.IDPendienteEnviar) == 1 else Partida.IDPartida.Subtotal-Ext_Precio.BalanceSubTotal
                        Ext_Precio.BalanceIva = 0 if CountFacturas(Partida.IDPendienteEnviar) == 1 else Partida.IDPartida.IVA-Ext_Precio.BalanceIva
                        Ext_Precio.BalanceRetencion = 0 if CountFacturas(Partida.IDPendienteEnviar) == 1 else Partida.IDPartida.Retencion-Ext_Precio.BalanceRetencion
                        Ext_Precio.BalanceTotal = 0 if CountFacturas(Partida.IDPendienteEnviar) == 1 else Partida.IDPartida.Total-Ext_Precio.BalanceTotal
                    Ext_Precio.save()
                    Partida.IDPartida.save()
                conRelacionFacturaxPartidas[0].IDFacturaxCliente.Status = 'CANCELADA'
                conRelacionFacturaxPartidas[0].IDFacturaxCliente.IDUsuarioBaja = AdmonUsuarios.objects.get(
                    idusuario=request.user.idusuario)
                conRelacionFacturaxPartidas[0].IDFacturaxCliente.MotivoEliminacion = Motivo
                conRelacionFacturaxPartidas[0].IDFacturaxCliente.save()
                return HttpResponse(status=200)
    except Exception as e:
        print(e)
        transaction.rollback(using='users')
        return HttpResponse(status=400)


def CountFacturas(IDPE):
    facturas = list()
    GetFacturas = RelacionFacturaxPartidas.objects.filter(IDPendienteEnviar=IDPE)
    for each in GetFacturas:
        if each.IDFacturaxCliente.Status != 'CANCELADA':
            facturas.append(True)
    return len(facturas)




def GetDetallesFactura(request):
    ListaViajes = list()
    IDFactura = request.GET["IDFactura"]
    conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente=IDFactura)
    if conRelacionFacturaxPartidas:
        for Partidas in conRelacionFacturaxPartidas:
            arr = {}
            ViewPen = View_PendientesEnviarCxC.objects.get(
                IDPendienteEnviar=Partidas.IDPendienteEnviar.IDPendienteEnviar)
            arr["Folio"] = ViewPen.Folio
            arr["FechaDescarga"] = ViewPen.FechaDescarga
            PartidaInd = Partida.objects.get(IDPartida=Partidas.IDPartida.IDPartida)
            arr["SubTotal"] = PartidaInd.Subtotal
            arr["Iva"] = PartidaInd.IVA
            arr["Retencion"] = PartidaInd.Retencion
            arr["Total"] = PartidaInd.Total
            ListaViajes.append(arr)
    htmlRes = render_to_string('TablaDetallesFactura.html', {'Pendientes': ListaViajes}, request=request, )
    return JsonResponse({'htmlRes': htmlRes})


def SaveCobroxCliente(request):
    jParams = json.loads(request.body.decode('utf-8'))
    try:
        with transaction.atomic(using='users'):
            if jParams["IsNotaCredito"]:
                GetNotaCredito = NotasCredito.objects.get(IDNotaCredito=jParams["IDNotaCreditoSelect"])
                if jParams["IDNotaCreditoSelect"] is not None and GetNotaCredito.Saldo == jParams["Total"]:
                    print(1)
                    SaveNotaxFactura = NotaCreditoxFacturas()
                    SaveNotaxFactura.FechaAlta = datetime.datetime.now()
                    SaveNotaxFactura.Total = jParams["Total"]
                    SaveNotaxFactura.save()
                    for each in jParams["arrCobros"]:
                        SaveRelacionNota = RelacionCobrosFacturasxCliente()
                        SaveRelacionNota.IDUsuarioAlta = request.user.idusuario
                        SaveRelacionNota.IDFactura = FacturasxCliente.objects.get(IDFactura=each["IDFactura"])
                        SaveRelacionNota.IDNotaCredito = NotasCredito.objects.get(
                            IDNotaCredito=GetNotaCredito.IDNotaCredito)
                        SaveRelacionNota.IDNotaCreditoxFactura = NotaCreditoxFacturas.objects.get(
                            IDNotaCreditoxFactura=SaveNotaxFactura.IDNotaCreditoxFactura)
                        SaveRelacionNota.save()
                        GetFactura = FacturasxCliente.objects.get(IDFactura=each["IDFactura"])
                        GetFactura.Saldo -= Decimal(each["Total"])
                        if truncate(float(GetFactura.Saldo), 2) == 0:
                            GetFactura.Status = "COBRADA"
                        else:
                            GetFactura.Status = "ABONADA"
                        GetFactura.save()
                    GetNotaCredito.Saldo = 0
                    GetNotaCredito.Status = 'COBRADA'
                    GetNotaCredito.save()
                    return HttpResponse(status=200)
                else:
                    print("here")
                    return HttpResponse(status=500)
            else:
                newCobro = CobrosxCliente()
                newCobro.FechaAlta = datetime.datetime.now()
                newCobro.Folio = jParams["Folio"]
                newCobro.Total = jParams["Total"]
                newCobro.FechaCobro = datetime.datetime.strptime(jParams["FechaCobro"], '%Y/%m/%d')
                newCobro.RutaXML = jParams["RutaXML"]
                newCobro.RutaPDF = jParams["RutaPDF"]
                newCobro.Comentarios = jParams["Comentarios"]
                newCobro.TipoCambio = jParams["TipoCambio"]
                newCobro.NombreCortoCliente = jParams["Cliente"]
                newCobro.IDCliente = jParams["IDCliente"]
                newCobro.IDUsuarioAlta = request.user.idusuario
                newCobro.save()
                for Cobro in jParams["arrCobros"]:
                    newCobroxFactura = CobrosxFacturas()
                    newCobroxFactura.Total = Cobro["Total"]
                    newCobroxFactura.FechaAlta = datetime.datetime.now()
                    newCobroxFactura.save()
                    newRelacionCobroxFactura = RelacionCobrosFacturasxCliente()
                    newRelacionCobroxFactura.IDCobro = CobrosxCliente.objects.get(IDCobro=newCobro.IDCobro)
                    newRelacionCobroxFactura.IDCobroxFactura = CobrosxFacturas.objects.get(
                        IDCobroxFactura=newCobroxFactura.IDCobroxFactura)
                    Factura = FacturasxCliente.objects.get(IDFactura=Cobro["IDFactura"])
                    Factura.Saldo -= Decimal(Cobro["Total"])
                    newRelacionCobroxFactura.IDFactura = Factura
                    newRelacionCobroxFactura.IDUsuarioAlta = request.user.idusuario
                    if truncate(float(Factura.Saldo), 2) == 0:
                        Factura.Status = "COBRADA"
                    else:
                        Factura.Status = "ABONADA"
                    Factura.save()
                    newRelacionCobroxFactura.save()
                return HttpResponse(status=200)
    except Exception as e:
        transaction.rollback(using='users')
        print(e)
        return HttpResponse(status=500)


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
        newRelacionCobroxFactura.IDCobro = CobrosxCliente.objects.get(IDCobro=jParams["IDCobro"])
        newRelacionCobroxFactura.IDCobroxFactura = CobrosxFacturas.objects.get(
            IDCobroxFactura=newCobroxFactura.IDCobroxFactura)
        Factura = FacturasxCliente.objects.get(IDFactura=Cobro["IDFactura"])
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
    IDFactura = request.GET["IDFactura"]
    FacturasxCobro = RelacionCobrosFacturasxCliente.objects.filter(IDFactura=IDFactura).select_related(
        'IDCobro').select_related('IDCobroxFactura')
    Facturas = list()
    for FacturaxCobro in FacturasxCobro:
        Cobro = {}
        if FacturaxCobro.IDCobro.Status != 'CANCELADA':
            Cobro["FolioCobro"] = FacturaxCobro.IDCobro.Folio
            Cobro["FechaCobro"] = FacturaxCobro.IDCobro.FechaCobro
            Cobro["Total"] = FacturaxCobro.IDCobroxFactura.Total
            Facturas.append(Cobro)
    htmlRes = render_to_string('TablaDetallesCobro.html', {'Facturas': Facturas}, request=request, )
    return JsonResponse({'htmlRes': htmlRes})


def GetNotaCreditoByCliente(request):
    try:
        NotasLista = list()
        IDCliente = request.GET['IDCliente']
        GetNotas = NotasCredito.objects.filter(IDClienteFiscal=IDCliente, Status='PENDIENTE')
        for i in GetNotas:
            value = {}
            value['IDNotaCredito'] = i.IDNotaCredito
            value['Folio'] = i.Folio
            value['Total'] = i.Total
            NotasLista.append(value)
        return JsonResponse({'GetNotas': NotasLista})
    except Exception as e:
        print(e)
        return HttpResponse(status=500)


def GetDatosReajuste(request):
    IDFactura = request.GET["IDFactura"]
    GetIDPendienteEnviar = RelacionFacturaxPartidas.objects.get(IDFacturaxCliente=IDFactura)
    GetIDConcepto = RelacionConceptoxProyecto.objects.get(IDPendienteEnviar=GetIDPendienteEnviar.IDPendienteEnviar)
    Data = DataFromProject(GetIDConcepto.IDConcepto, GetIDPendienteEnviar.IDPendienteEnviar.Proyecto,
                           GetIDPendienteEnviar.IDFacturaxCliente.TotalXML)
    return JsonResponse({'data': Data})


def DataFromProject(IDConcepto, proyecto, TotalXMLFactura):
    GetData = XD_Viajes.objects.get(XD_IDViaje=IDConcepto) if proyecto == 'XD' else Bro_Viajes.objects.get(
        IDBro_Viaje=IDConcepto)
    DataList = list()
    data = {
        "IDViaje": GetData.XD_IDViaje if proyecto == 'XD' else GetData.IDBro_Viaje,
        "Proyecto": 'XD' if proyecto == 'XD' else 'BKG',
        "Precio": GetData.Precio if proyecto == 'XD' else GetData.PrecioViaje,
        "PrecioSubtotal": GetData.PrecioSubTotal if proyecto == 'XD' else GetData.Subtotal,
        "PrecioIVA": GetData.PrecioIVA,
        "PrecioRetencion": GetData.PrecioRetencion,
        "PrecioTotal": GetData.PrecioTotal,
        "PrecioRepartos": GetData.PrecioRepartos if proyecto == 'XD' else GetData.PrecioTotalRepartos,
        "PrecioAccesorios": GetData.PrecioAccesorios if proyecto == 'XD' else GetData.PrecioServicios,
        "PrecioRecoleccion": 0 if proyecto == 'XD' else GetData.PrecioTotalRecoleccion,
        "TotalCliente": TotalXMLFactura
    }
    DataList.append(data)
    return DataList


def GetRepartosPrecio(request):
    IDViaje = request.GET["Viaje"]
    Proyecto = request.GET["Project"]
    RepartosList = list()
    GetRepartos = Bro_RepartosxViaje.objects.filter(
        IDBro_Viaje=IDViaje) if Proyecto == 'BKG' else RepartosxViaje.objects.filter(XD_IDViaje=IDViaje)
    for each in GetRepartos:
        data = {
            "IDReparto": each.IDBro_RepartoxViaje if Proyecto == 'BKG' else each.IDRepartoxViaje,
            "IDViaje": each.IDBro_Viaje if Proyecto == 'BKG' else each.XD_IDViaje,
            "Precio": each.PrecioReparto if Proyecto == 'BKG' else each.Precio,
            "Estado": each.Estado if Proyecto == 'BKG' else None,
            "Proyecto": "BKG" if Proyecto == 'BKG' else "XD"
        }
        RepartosList.append(data)
    return JsonResponse({'data': RepartosList})


def GetAccesoriosPrecio(request):
    IDViaje = request.GET["Viaje"]
    Proyecto = request.GET["Project"]
    GetRepartos = Bro_ServiciosxViaje.objects.filter(
        IDBro_Viaje=IDViaje) if Proyecto == 'BKG' else XD_AccesoriosxViajes.objects.filter(XD_IDViaje=IDViaje)
    Accesorios = JsonAccesoriosXD() if Proyecto == 'XD' else JsonAccesoriosBKG()
    for each in GetRepartos:
        for i in Accesorios["Principales"] if Proyecto == 'XD' else Accesorios:
            if Proyecto == 'XD':
                i['precio'] = each.Precio if i["descripcion"] == each.Descripcion else 0
            else:
                i['precio'] = each.Precio if i["descripcion"] == each.IDBro_Servicio.Descripcion else 0
    return JsonResponse({'data': Accesorios["Principales"] if Proyecto == 'XD' else Accesorios})

def JsonAccesoriosXD():
    JsonData = {
        "Principales":
        [
            {
                "descripcion": "Almacenaje",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Demora",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Estadias",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Maniobras de carga",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Maniobras de descarga",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Peaje",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Recarga de ajuste de gasolina",
                "precio": 0,
                "IsAplicaRetencion": True,
                "IsAplicaIVA": False
            },
            {
                "descripcion": "Retraso",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Viaje Local",
                "precio": 0,
                "IsAplicaRetencion": True,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Custodias",
                "precio": 0,
                "IsAplicaRetencion": False,
                "IsAplicaIVA": True
            },
            {
                "descripcion": "Otro",
                "precio": 0,
                "IsAplicaRetencion": True,
                "IsAplicaIVA": True
            }
        ]
    }
    return JsonData

def JsonAccesoriosBKG():
    GetServicios = ServiciosBKG.objects.all().exclude(IsCircuito=1)
    Servicioslist = list()
    for each in GetServicios:
        data = {
            "descripcion": each.Nombre,
            "precio": 0,
            "IsAplicaRetencion": each.IsAplicaRetencion,
            "IsAplicaIVA": each.IsAplicaIva
        }
        Servicioslist.append(data)
    return Servicioslist


def DatosTemporales(request):
    try:
        file = pd.read_excel(open('static/temporal.xlsx', 'rb'), sheet_name='Hoja de datos')
        print(file)
    except Exception as e:
        print(e)
    #CREAR ARCHIVO EXCEL
    # df = pd.DataFrame({'Id': [1, 3, 2, 4],
    #                    'Nombre': ['Juan', 'Eva', 'María', 'Pablo'],
    #                    'Apellido': ['Méndez', 'López', 'Tito', 'Hernández']})
    # df = df[['Id', 'Nombre', 'Apellido']]
    # writer = ExcelWriter('static/temporal.xlsx')
    # df.to_excel(writer, 'Hoja de datos', index=False)
    # writer.save()

    # CREAR ARCHIVO TXT
    # file = open("static/temporal.txt", "w")
    # file.write("Hello fucking world" + os.linesep)
    # file.write("Hello fucking world 2")
    # file.close()

def RemoveFile(self):
    os.remove('static/temporal.xlsx')