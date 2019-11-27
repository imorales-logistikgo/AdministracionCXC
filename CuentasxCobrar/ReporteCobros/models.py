from django.db import models

# Create your models here.

# class CobrosxFacturas(models.Model):
#     IDCobroxFactura = models.AutoField(primary_key=True)
#     FechaAlta = models.DateTimeField()
#     Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)

#     class Meta:
#         db_table="CobrosxFacturas"
#         managed= False



# class CobrosxCliente(models.Model):
#     IDCobro = models.AutoField(primary_key=True)
#     FechaAlta = models.DateTimeField()
#     Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
#     Folio = models.CharField(max_length=10, unique=True)
#     RutaPDF = models.CharField(max_length=300)
#     RutaXML = models.CharField(max_length=300)
#     FechaCobro = models.DateTimeField()
#     Comentarios = models.CharField(max_length=500, default = "")
#     TipoCambio = models.DecimalField(default=1, max_digits=10, decimal_places=5)

#     class Meta:
#         db_table="CobrosxCliente"
#         managed= False



# class RelacionCobrosFacturasxCliente(models.Model):
#     IDRelacionCobroFacturasxCliente = models.AutoField(primary_key=True)
#     IDCobro = models.ForeignKey(CobrosxCliente, on_delete=models.CASCADE, db_column = 'IDCobro')
#     IDCobroxFactura = models.ForeignKey(CobrosxFacturas, on_delete=models.CASCADE, db_column = 'IDCobroxFactura')
#     IDFactura = models.ForeignKey(FacturasxCliente, on_delete=models.CASCADE, db_column = 'IDFactura')
#     IDUsuarioAlta = models.IntegerField(default=0)
#     IDCliente = models.IntegerField(default=0)

#     class Meta:
#         db_table="RelacionCobrosFacturasxCliente"
#         managed= False