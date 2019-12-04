# Generated by Django 2.1.13 on 2019-11-19 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EstadosdeCuenta', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PendientesEnviar',
            fields=[
                ('IDPendienteEnviar', models.AutoField(primary_key=True, serialize=False)),
                ('Folio', models.CharField(max_length=10, unique=True)),
                ('NombreCortoCliente', models.CharField(max_length=100)),
                ('NombreCortoProveedor', models.CharField(max_length=100)),
                ('FechaDescarga', models.CharField(max_length=100, null=True)),
                ('Moneda', models.CharField(max_length=10)),
                ('CostoSubtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('CostoIVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('CostoRetencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('CostoTotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioSubtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioIVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioRetencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioTotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Status', models.CharField(max_length=15)),
                ('IsFacturaCliente', models.BooleanField()),
                ('IsFacturaProveedor', models.BooleanField()),
                ('IsEvidenciaFisica', models.BooleanField()),
                ('IsEvidenciaDigital', models.BooleanField()),
            ],
            options={
                'db_table': 'PendientesEnviar',
                'managed': False,
            },
        ),
    ]
