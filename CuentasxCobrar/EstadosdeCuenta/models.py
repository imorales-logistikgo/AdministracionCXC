from django.db import models

class FacturasxCliente(models.Model):
    IDFactura = models.AutoField(primary_key=True)
    Folio = models.CharField(max_length=50, unique=True)
    NombreCortoCliente = models.CharField(max_length=100)
    FechaFactura = models.DateTimeField()
    FechaRevision = models.DateTimeField()
    FechaVencimiento = models.DateTimeField()
    Moneda = models.CharField(max_length=10)
    Subtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Retencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Saldo = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IsAutorizada = models.BooleanField(default=False)
    RutaXML = models.CharField(max_length=300)
    RutaPDF = models.CharField(max_length=300)
    TipoCambio = models.DecimalField(default=0, max_digits=10, decimal_places=5)
    Comentarios = models.CharField(max_length=500)
    TotalConvertido = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Status = models.CharField(max_length=15, default="Pendiente")

    def __str__(self):
        return str(self.IDFactura)

    class Meta:
        db_table = "FacturasxCliente"
        managed= False


class Partida(models.Model):
    IDPartida = models.AutoField(primary_key=True)
    FechaAlta = models.DateTimeField()
    FechaBaja = models.DateTimeField(null=True, blank=True)
    Subtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Retencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IsActiva = models.BooleanField(default=True)

    class Meta:
        db_table = "Partida"
        managed= False


class RelacionFacturaxPartidas(models.Model):
    IDRelacionFacturaxPartidas = models.AutoField(primary_key=True)
    IDFacturaxCliente = models.ForeignKey(FacturasxCliente, on_delete=models.CASCADE, db_column = 'IDFacturaxCliente')
    IDPartida = models.ForeignKey(Partida, on_delete=models.CASCADE, db_column = 'IDPartida')
    IDConcepto = models.IntegerField(default=0)
    IDUsuarioAlta = models.IntegerField(default=0)
    IDUsuarioBaja = models.IntegerField(default=0)

    class Meta:
        db_table = "RelacionFacturaxPartidas"
        managed= False



class View_FacturasxCliente(models.Model):
    IDFactura = models.IntegerField(primary_key=True)
    Folio = models.CharField(max_length=50)
    Cliente = models.CharField(max_length=100)
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

    class Meta:
        db_table = "View_FacturasxCliente"
        managed= False



class PendientesEnviar(models.Model):
    IDPendienteEnviar = models.AutoField(primary_key=True)
    Folio = models.CharField(max_length=10, unique=True)
    NombreCortoCliente = models.CharField(max_length=100)
    NombreCortoProveedor = models.CharField(max_length=100)
    FechaDescarga = models.CharField(max_length=100, null=True)
    Moneda = models.CharField(max_length=10)
    #Costo = models.FloatField(default=0)
    CostoSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    #Precio = models.FloatField(default=0)
    PrecioSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Status = models.CharField(max_length=15)
    IsFacturaCliente = models.BooleanField()
    IsFacturaProveedor = models.BooleanField()
    IsEvidenciaFisica = models.BooleanField()
    IsEvidenciaDigital = models.BooleanField()

    def __str__(self):
        return str(self.IDPendienteEnviar)

    class Meta:
        db_table="PendientesEnviar"
        managed= False



class RelacionConceptoxProyecto(models.Model):
    RelacionIDConceptoxProyecto = models.AutoField(primary_key=True)
    IDPendienteEnviar = models.ForeignKey(PendientesEnviar, on_delete=models.CASCADE, db_column = 'IDPendienteEnviar')
    IDConcepto = models.IntegerField(default=0)
    IDCliente = models.IntegerField(default=0)
    IDProveedor = models.IntegerField(default=0)
    Proyecto = models.CharField(max_length=30)

    class Meta:
        db_table="RelacionConceptoxProyecto"
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

    class Meta:
        db_table="CobrosxCliente"



class RelacionCobrosFacturasxCliente(models.Model):
    IDRelacionCobroFacturasxCliente = models.AutoField(primary_key=True)
    IDCobro = models.ForeignKey(CobrosxCliente, on_delete=models.CASCADE, db_column = 'IDCobro')
    IDCobroxFactura = models.ForeignKey(CobrosxFacturas, on_delete=models.CASCADE, db_column = 'IDCobroxFactura')
    IDFactura = models.ForeignKey(FacturasxCliente, on_delete=models.CASCADE, db_column = 'IDFactura')
    IDUsuarioAlta = models.IntegerField(default=0)
    IDCliente = models.IntegerField(default=0)

    class Meta:
        db_table="RelacionCobrosFacturasxCliente"