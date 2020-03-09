from django.db import models

class XD_Viajes(models.Model):
    XD_IDViaje = models.AutoField(db_column='XD_IDViaje', primary_key=True)
    PrecioTotal = models.DecimalField(db_column='PrecioTotal',default=0, max_digits=30, decimal_places=5)

    class Meta:
        managed = False
        db_table = 'XD_Viajes'
