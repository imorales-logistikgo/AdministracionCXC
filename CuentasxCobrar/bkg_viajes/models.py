from django.db import models

class Bro_Viajes(models.Model):
    IDBro_Viaje = models.AutoField(db_column='IDBro_Viaje', primary_key=True)
    PrecioTotal = models.DecimalField(db_column='PrecioTotal',default=0, max_digits=30, decimal_places=5)

    class Meta:
        managed = False
        db_table = 'Bro_Viajes'
