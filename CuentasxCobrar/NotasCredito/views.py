import json, datetime
import os
import urllib
import uuid
from xml.dom import minidom
from azure.storage.blob import BlobClient
from django.db import transaction
from django.db.models import Q
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# Create your views here.
from EstadosdeCuenta.models import RelacionCobrosFacturasxCliente
from NotasCredito.models import NotasCredito
from PendienteEnviar.models import FacturasxCliente
from usersadmon.models import Cliente, AdmonUsuarios
from django.conf import settings

RutaXMl = None
RutaPDF = None
FolioNota = None
SubtotalNota = 0
IVANota = 0
RetencionNota = 0
TotalNota = 0


def variableXML(xml):
    global RutaXMl
    RutaXMl = xml
def variablePDF(pdf):
    global RutaPDF
    RutaPDF = pdf
def variableFolio(folio):
    global FolioNota
    FolioNota = folio
def variableSubtotal(subtotal):
    global SubtotalNota
    SubtotalNota = subtotal
def variableIVA(iva):
    global IVANota
    IVANota = iva
def variableRetencion(retencion):
    global RetencionNota
    RetencionNota = retencion
def variableTotal(total):
    global TotalNota
    TotalNota = total

def NotaCredito(request):
    GetNotasCredito = NotasCredito.objects.all()
    Clientes = Cliente.objects.filter(isFiscal=True).exclude(Q(NombreCorto="") | Q(StatusProceso="BAJA"))
    return render(request, 'NotasCredito.html', {'GetNotasCredito': GetNotasCredito, 'Clientes': Clientes})


def FilesNotasCredito(request):
    try:
        if request.POST['type'] == 'application/pdf':
            NameFilePDF = str(uuid.uuid4()) + ".pdf"
            urlpdf = uploadf(NameFilePDF, request.FILES['files[]'])
            variablePDF(urlpdf)
            return JsonResponse({"url": urlpdf})
        elif request.POST['type'] == 'text/xml':
            NameFileXML = str(uuid.uuid4()) + ".xml"
            urlxml = uploadf(NameFileXML, request.FILES['files[]'])
            archivo = urllib.request.urlopen(urlxml)
            xml = minidom.parse(archivo)
            TagsXML = xml.getElementsByTagName('cfdi:Comprobante')[0]
            variableSubtotal(TagsXML.attributes['SubTotal'].value)
            variableTotal(TagsXML.attributes['Total'].value)
            variableIVA(GetIVAFromXML(TagsXML))
            variableRetencion(GetRetencionXML(TagsXML))
            GetFolioNotaCredito = TagsXML.attributes['Serie'].value + TagsXML.attributes['Folio'].value
            if not NotasCredito.objects.filter(Folio=GetFolioNotaCredito.upper()).exists():
                variableXML(urlxml)
                variableFolio(GetFolioNotaCredito.upper())
                return JsonResponse({"url": urlxml, "folio": GetFolioNotaCredito.upper()})
            else:
                HttpResponse(status=500)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)

def uploadf(name, file):
    blob_service_client = BlobClient.from_connection_string(
        conn_str=settings.AZURE_UPLOAD,
        container_name=settings.CONTAINER_NAME, blob_name=name)
    blob_service_client.upload_blob(file)
    return blob_service_client.url

# def uploadp(name, file):
#     blob_service_client = BlobClient.from_connection_string(
#         conn_str=settings.AZURE_UPLOAD,
#         container_name=settings.CONTAINER_NAME, blob_name=name,  max_connections=2)
#     blob_service_client.upload_blob(file)
#     return blob_service_client.url


def GetIVAFromXML(xml):
    try:
        TagConceptos = xml.getElementsByTagName('cfdi:Conceptos')[0]
        TagConcepto = TagConceptos.getElementsByTagName('cfdi:Concepto')[0]
        TagImpuestos = TagConcepto.getElementsByTagName('cfdi:Impuestos')[0]
        TagTraslados = TagImpuestos.getElementsByTagName('cfdi:Traslados')[0]
        TagTraslado = TagTraslados.getElementsByTagName('cfdi:Traslado')[0]
        return TagTraslado.attributes["Importe"].value
    except Exception as e:
        print(e)
        return HttpResponse(status=500)

def GetRetencionXML(xml):
    try:
        TagConceptos = xml.getElementsByTagName('cfdi:Conceptos')[0]
        TagConcepto = TagConceptos.getElementsByTagName('cfdi:Concepto')[0]
        TagImpuestos = TagConcepto.getElementsByTagName('cfdi:Impuestos')[0]
        TagRetenciones = TagImpuestos.getElementsByTagName('cfdi:Retenciones')[0]
        TagRetencion = TagRetenciones.getElementsByTagName('cfdi:Retencion')[0]
        return TagRetencion.attributes["Importe"].value
    except Exception as e:
        print(e)
        return 0

def SaveNotaCredito(request):
    try:
        with transaction.atomic(using='users'):
            jParams = json.loads(request.body.decode('utf-8'))
            NewNotaCredito = NotasCredito()
            NewNotaCredito.IDClienteFiscal = Cliente.objects.get(IDCliente=jParams['IDCliente'])
            NewNotaCredito.IDUsuarioAlta = AdmonUsuarios.objects.get(idusuario=request.user.idusuario)
            NewNotaCredito.FechaAlta = datetime.datetime.now()
            NewNotaCredito.Folio = FolioNota
            NewNotaCredito.Subtotal = SubtotalNota
            NewNotaCredito.IVA = IVANota
            NewNotaCredito.Retencion = RetencionNota
            NewNotaCredito.Total = TotalNota
            NewNotaCredito.Saldo = TotalNota
            NewNotaCredito.Status = "PENDIENTE"
            NewNotaCredito.RutaXML = RutaXMl
            NewNotaCredito.RutaPDF = RutaPDF
            NewNotaCredito.save()
            return HttpResponse(status=200)
    except Exception as e:
        transaction.rollback(using='users')
        print(e)
        return HttpResponse(status=500)

def EliminarNotaCredito(request):
    try:
        with transaction.atomic(using='users'):
            jParams = json.loads(request.body.decode('utf-8'))
            GetNotaCredito = NotasCredito.objects.get(IDNotaCredito=jParams["IDNota"])
            GetNotaCredito.Status = 'CANCELADA'
            GetNotaCredito.save()
            GetIDFactura = RelacionCobrosFacturasxCliente(IDNotaCredito=jParams["IDNota"])
            GetFactura = FacturasxCliente.objects.get(IDFactura=GetIDFactura.IDCobroxFactura.IDFactura)
            # GetFactura.Saldo += GetNotaCredito.Total
            # if Factura.IDFactura.Saldo == Factura.IDFactura.Total:
            #     Factura.IDFactura.Status = "PENDIENTE"
            # else:
            #     Factura.IDFactura.Status = "ABONADA"
    except Exception as e:
        print(e)
        transaction.rollback(using='users')
        return HttpResponse(status=500)