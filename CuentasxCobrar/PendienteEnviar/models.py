from django.db import models

class PendientesEnviar(models.Model):
    IDPendienteEnviar = models.AutoField(primary_key=True)
    Folio = models.CharField(max_length=50, unique=True)
    NombreCortoCliente = models.CharField(max_length=100)
    NombreCortoProveedor = models.CharField(max_length=100)
    FechaDescarga = models.DateTimeField()
    Moneda = models.CharField(max_length=10)
    #Costo = models.FloatField(default=0)
    #Precio = models.FloatField(default=0)
    Status = models.CharField(max_length=15)
    IsEvidenciaFisica = models.BooleanField()
    IsEvidenciaDigital = models.BooleanField()
    Proyecto = models.CharField(max_length=30)
    TipoConcepto = models.CharField(max_length=30)

    def __str__(self):
        return str(self.IDPendienteEnviar)
    class Meta:
        db_table="PendientesEnviar"
        managed= False


class Ext_PendienteEnviar_Costo(models.Model):
    IDPendienteEnviar = models.OneToOneField(PendientesEnviar, on_delete=models.CASCADE, db_column = 'IDPendienteEnviar', primary_key=True)
    CostoSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IsFacturaProveedor = models.BooleanField(default=False)
    class Meta:
        db_table="Ext_PendienteEnviar_Costo"
        managed= False


class Ext_PendienteEnviar_Precio(models.Model):
    IDPendienteEnviar = models.OneToOneField(PendientesEnviar, on_delete=models.CASCADE, db_column = 'IDPendienteEnviar', primary_key=True)
    PrecioSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioServicios = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IsFacturaCliente = models.BooleanField(default=False)
    class Meta:
        db_table="Ext_PendienteEnviar_Precio"
        managed= False


class RelacionConceptoxProyecto(models.Model):
    RelacionIDConceptoxProyecto = models.AutoField(primary_key=True)
    IDPendienteEnviar = models.ForeignKey(PendientesEnviar, on_delete=models.CASCADE, db_column = 'IDPendienteEnviar')
    IDConcepto = models.IntegerField(default=0)
    IDCliente = models.IntegerField(default=0)
    IDProveedor = models.IntegerField(default=0)

    class Meta:
        db_table="RelacionConceptoxProyecto"
        managed= False


class View_PendientesEnviarCxC(models.Model):
    IDPendienteEnviar = models.IntegerField(primary_key=True)
    IDConcepto = models.IntegerField(default=0)
    Folio = models.CharField(max_length=10, unique=True)
    IDCliente = models.IntegerField(default=0)
    NombreCliente = models.CharField(max_length=100)
    FechaDescarga = models.DateTimeField()
    Subtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Retencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Servicios = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Moneda = models.CharField(max_length=10)
    Status = models.CharField(max_length=15)
    IsEvidenciaDigital = models.BooleanField()
    IsEvidenciaFisica = models.BooleanField()
    Proyecto = models.CharField(max_length=30)
    IsFacturaCliente = models.BooleanField()

    class Meta:
        managed = False
        db_table = "View_PendientesEnviarCxC"
    def str(self):
        return self.IDPendienteEnviar


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

    class Meta:
        db_table = "FacturasxCliente"


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


class RelacionFacturaxPartidas(models.Model):
    IDRelacionFacturaxPartidas = models.AutoField(primary_key=True)
    IDFacturaxCliente = models.ForeignKey(FacturasxCliente, on_delete=models.CASCADE, db_column = 'IDFacturaxCliente')
    IDPartida = models.ForeignKey(Partida, on_delete=models.CASCADE, db_column = 'IDPartida')
    IDPendienteEnviar = models.ForeignKey(PendientesEnviar, on_delete=models.CASCADE, db_column = 'IDPendienteEnviar')
    IDUsuarioAlta = models.IntegerField(default=0)
    IDUsuarioBaja = models.IntegerField(default=0)

    class Meta:
        db_table = "RelacionFacturaxPartidas"
