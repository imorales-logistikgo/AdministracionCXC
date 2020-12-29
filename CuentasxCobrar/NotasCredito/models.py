from django.db import models
from usersadmon.models import Cliente, AdmonUsuarios


class NotasCredito(models.Model):
    IDNotaCredito = models.AutoField(primary_key=True)
    IDClienteFiscal = models.ForeignKey(Cliente, on_delete=models.CASCADE, db_column='IDClienteFiscal')
    IDUsuarioAlta = models.ForeignKey(AdmonUsuarios, on_delete=models.CASCADE, db_column='IDUsuarioAlta')
    FechaAlta = models.DateTimeField()
    Folio = models.CharField(max_length=20)
    Subtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Retencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Saldo = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Status = models.CharField(max_length=50)
    RutaXML = models.CharField(max_length=300)
    RutaPDF = models.CharField(max_length=300)

    class Meta:
        managed = False
        db_table = 'NotasCredito'