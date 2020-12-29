from django.db import models

from NotasCredito.models import NotasCredito
from PendienteEnviar.models import PendientesEnviar, FacturasxCliente


class View_FacturasxCliente(models.Model):
    IDFactura = models.IntegerField(primary_key=True)
    Folio = models.CharField(max_length=50)
    Cliente = models.CharField(max_length=100)
    IDCliente = models.IntegerField(default=0)
    FechaFactura = models.DateTimeField()
    Subtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Retencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Saldo = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    RutaXML = models.CharField(max_length=300)
    Status = models.CharField(max_length=15)
    IsAutorizada = models.BooleanField()
    Moneda = models.CharField(max_length=10)
    IsFragmentada = models.BooleanField()
    TotalXML = models.DecimalField(max_digits=30, decimal_places=5)

    class Meta:
        db_table = "View_FacturasxCliente"
        managed= False



class CobrosxFacturas(models.Model):
    IDCobroxFactura = models.AutoField(primary_key=True)
    FechaAlta = models.DateTimeField()
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)

    class Meta:
        db_table="CobrosxFacturas"



class CobrosxCliente(models.Model):
    IDCobro = models.AutoField(primary_key=True)
    FechaAlta = models.DateTimeField()
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Folio = models.CharField(max_length=50, unique=True)
    RutaPDF = models.CharField(max_length=300)
    RutaXML = models.CharField(max_length=300)
    FechaCobro = models.DateTimeField()
    Comentarios = models.CharField(max_length=500, default = "")
    TipoCambio = models.DecimalField(default=1, max_digits=10, decimal_places=5)
    NombreCortoCliente = models.CharField(max_length=100)
    IDCliente = models.IntegerField(default=0)
    Status = models.CharField(db_column = 'Status', max_length=15, default = "")
    IDUsuarioAlta = models.IntegerField(default=0)
    IDUsuarioBaja = models.IntegerField()
    FechaBaja = models.DateTimeField()
    MotivoEliminacion = models.CharField(max_length=500)

    class Meta:
        db_table="CobrosxCliente"



class NotaCreditoxFacturas(models.Model):
    IDNotaCreditoxFactura = models.AutoField(primary_key=True)
    FechaAlta = models.DateTimeField()
    Total = models.DecimalField(max_digits=30, decimal_places=5)

    class Meta:
        db_table = "NotaCreditoxFacturas"



class RelacionCobrosFacturasxCliente(models.Model):
    IDRelacionCobroFacturasxCliente = models.AutoField(primary_key=True)
    IDCobro = models.ForeignKey(CobrosxCliente, on_delete=models.CASCADE, db_column='IDCobro')
    IDCobroxFactura = models.ForeignKey(CobrosxFacturas, on_delete=models.CASCADE, db_column='IDCobroxFactura')
    IDFactura = models.ForeignKey(FacturasxCliente, on_delete=models.CASCADE, db_column='IDFactura')
    IDUsuarioAlta = models.IntegerField(default=0)
    IDNotaCredito = models.ForeignKey(NotasCredito, on_delete=models.CASCADE, db_column='IDNotaCredito')
    IDNotaCreditoxFactura = models.ForeignKey(NotaCreditoxFacturas, on_delete=models.CASCADE, db_column='IDNotaCreditoxFactura')

    class Meta:
        db_table = "RelacionCobrosFacturasxCliente"
