from django.db import models

class View_Master_Cliente(models.Model):
    IDPendienteEnviar = models.IntegerField(primary_key=True)
    Folio = models.CharField(max_length=10)
    NombreCortoCliente = models.CharField(max_length=100)
    IDCliente = models.IntegerField()
    FechaDescarga = models.DateTimeField()
    Moneda = models.CharField(max_length=10)
    Status = models.CharField(max_length=15)
    IsEvidenciaDigital = models.BooleanField()
    IsEvidenciaFisica = models.BooleanField()
    Proyecto = models.CharField(max_length=30)
    TipoConcepto = models.CharField(max_length=30)
    IsControlDesk = models.BooleanField()
    PrecioSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IsFacturaCliente = models.BooleanField()
    FolioFactCliente = models.CharField(max_length=50)
    SubtotalFactura = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IvaFactura = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    RetencionFactura = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    TotalFactura = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    StatusFacCliente = models.CharField(max_length=50)

    class Meta:
        db_table = "View_Master_Cliente"
        managed = False
