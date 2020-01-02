import base64
from django.db import models
import binascii

class AdmonUsuarios(models.Model):
    idusuario = models.AutoField(db_column='IDUsuario', primary_key=True)  # Field name made lowercase.
    nombreusuario = models.CharField(db_column='NombreUsuario', max_length=200, blank=True, null=True)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=200, blank=True, null=True)  # Field name made lowercase.
    apepaterno = models.CharField(db_column='ApePaterno', max_length=100, blank=True, null=True)  # Field name made lowercase.
    apematerno = models.CharField(db_column='ApeMaterno', max_length=100, blank=True, null=True)  # Field name made lowercase.
    correo = models.CharField(db_column='Correo', max_length=200, blank=True, null=True)  # Field name made lowercase.
    fechacambiocontrasena = models.DateTimeField(db_column='FechaCambioContrasena', blank=True, null=True)  # Field name made lowercase.
    hasbytes = models.BinaryField(db_column='HasBytes', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    saltbytes = models.BinaryField(db_column='SaltBytes', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    periodo = models.IntegerField(db_column='Periodo', blank=True, null=True)  # Field name made lowercase.
    statusreg = models.CharField(db_column='StatusReg', max_length=20, blank=True, null=True)  # Field name made lowercase.


    class Meta:
        managed = False
        db_table = 'AdmonUsuarios'