from django.shortcuts import render
from PendienteEnviar.models import FacturasxCliente,Partida,RelacionFacturaxPartidas,PendientesEnviar
from usersadmon.models import Cliente, AdmonUsuarios
from django.db.models import Q,Sum
from django.db import connections
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
import json,datetime

# Create your views here.

def getFacturas(arg):
    fechaHoy=datetime.datetime.now()
    fecheIni=fechaHoy.strftime('%Y'+'-'+'%m'+'-'+'1')
    fechaFini=fechaHoy.strftime('%Y'+'-'+'%m'+'-'+'30')
    with connections['users'].cursor() as cursor:
        Clientes = Cliente.objects.filter(isFiscal = True).exclude(Q(NombreCorto = "") | Q(StatusProceso = "BAJA"))
        ListaDeClientes=list()
        for c in Clientes:
            ListaDeClientes.append(str(c.IDCliente))
        stringListaClientes=','.join(ListaDeClientes)
        cursor.execute("{call dbo.sp_ReporteFacturasXFolio(%s,%s,%s,%s,%s)}", [fecheIni, fechaFini,'MXN,USD','PENDIENTE,ABONADA,COBRADA',stringListaClientes])
        row=dictfetchall(cursor)
    return render(arg, 'reporteTotales.html', {'reportTotal':row,'ClientesFiscales':Clientes})


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def getFacturasByFilters(request):
    jParams = json.loads(request.body.decode('utf-8'))
    fechaInicio=jParams["fechaInicio"]
    fechaTermino=jParams["fechaFin"]
    estatusFactura=jParams["status"]
    ClientesFiscales=jParams["ClientesFiscales"]
    monedaFactura=jParams["monedaFactura"]
    with connections['users'].cursor() as cursor:
        cursor.execute("{call dbo.sp_ReporteFacturasXFolio(%s,%s,%s,%s,%s)}", [fechaInicio, fechaTermino,monedaFactura,estatusFactura,ClientesFiscales])
        row=dictfetchall(cursor)
    htmlRes = render_to_string('TablaReporteTotales.html', {'reportTotal':row}, request = request)
    return JsonResponse({'htmlRes' : htmlRes})

def getReporteTotales(request):
    jsonparams = json.loads(request.body.decode('utf-8'))
    fechaHoy=jsonparams["fechaCorte"]
    print(fechaHoy)
    # fecheIni=fechaHoy.strftime('%Y'+'-'+'%m'+'-'+'%d')
    fecha_dt = datetime.datetime.strptime(fechaHoy, '%Y-%m-%d').date()
    print(fecha_dt)
    totalvencido=0;
    totalxVencer=0;
    getClientes=FacturasxCliente.objects.values('IDCliente').distinct()
    listaTotales=list();
    for g in getClientes:
        array={}
        getFacturas=FacturasxCliente.objects.filter(IDCliente=str(g["IDCliente"])).exclude(Status__in=['CANCELADA','COBRADA'])
        for get in getFacturas:
            if get.FechaFactura.date()<=fecha_dt:
                totalvencido=totalvencido+get.Saldo
            else:
                totalxVencer=totalxVencer+get.Saldo
        clienteFis=Cliente.objects.get(IDCliente=str(g["IDCliente"])).NombreCorto
        array["nombreCliente"]=clienteFis
        array["totalVencido"]=totalvencido
        array["totalxVencer"]=totalxVencer
        array["sumTotal"]=totalvencido+totalxVencer
        listaTotales.append(array)
        totalvencido=0;
        totalxVencer=0;
    htmlRes = render_to_string('TablaReporteTotalesModal.html', {'totalesModal':listaTotales}, request = request)
    return JsonResponse({'htmlRes' : htmlRes})
