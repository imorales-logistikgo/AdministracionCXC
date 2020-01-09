# Generated by Django 2.1.13 on 2020-01-03 16:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PendientesEnviar',
            fields=[
                ('IDPendienteEnviar', models.AutoField(primary_key=True, serialize=False)),
                ('Folio', models.CharField(max_length=50, unique=True)),
                ('NombreCortoCliente', models.CharField(max_length=100)),
                ('NombreCortoProveedor', models.CharField(max_length=100)),
                ('FechaDescarga', models.DateTimeField()),
                ('Moneda', models.CharField(max_length=10)),
                ('Status', models.CharField(max_length=15)),
                ('IsEvidenciaFisica', models.BooleanField()),
                ('IsEvidenciaDigital', models.BooleanField()),
                ('Proyecto', models.CharField(max_length=30)),
                ('TipoConcepto', models.CharField(max_length=30)),
            ],
            options={
                'db_table': 'PendientesEnviar',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='RelacionConceptoxProyecto',
            fields=[
                ('RelacionIDConceptoxProyecto', models.AutoField(primary_key=True, serialize=False)),
                ('IDConcepto', models.IntegerField(default=0)),
                ('IDCliente', models.IntegerField(default=0)),
                ('IDProveedor', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'RelacionConceptoxProyecto',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='View_PendientesEnviarCxC',
            fields=[
                ('IDPendienteEnviar', models.IntegerField(primary_key=True, serialize=False)),
                ('IDConcepto', models.IntegerField(default=0)),
                ('Folio', models.CharField(max_length=10, unique=True)),
                ('IDCliente', models.IntegerField(default=0)),
                ('NombreCliente', models.CharField(max_length=100)),
                ('FechaDescarga', models.DateTimeField()),
                ('Subtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Retencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Total', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Servicios', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Moneda', models.CharField(max_length=10)),
                ('Status', models.CharField(max_length=15)),
                ('IsEvidenciaDigital', models.BooleanField()),
                ('IsEvidenciaFisica', models.BooleanField()),
                ('Proyecto', models.CharField(max_length=30)),
                ('IsFacturaCliente', models.BooleanField()),
            ],
            options={
                'db_table': 'View_PendientesEnviarCxC',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='FacturasxCliente',
            fields=[
                ('IDFactura', models.AutoField(primary_key=True, serialize=False)),
                ('Folio', models.CharField(max_length=50, unique=True)),
                ('NombreCortoCliente', models.CharField(max_length=100)),
                ('FechaFactura', models.DateTimeField()),
                ('FechaRevision', models.DateTimeField()),
                ('FechaVencimiento', models.DateTimeField()),
                ('Moneda', models.CharField(max_length=10)),
                ('Subtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Retencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Total', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Saldo', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IsAutorizada', models.BooleanField(default=False)),
                ('RutaXML', models.CharField(max_length=300)),
                ('RutaPDF', models.CharField(max_length=300)),
                ('TipoCambio', models.DecimalField(decimal_places=5, default=0, max_digits=10)),
                ('Comentarios', models.CharField(max_length=500)),
                ('TotalConvertido', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Status', models.CharField(default='PENDIENTE', max_length=15)),
            ],
            options={
                'db_table': 'FacturasxCliente',
            },
        ),
        migrations.CreateModel(
            name='Partida',
            fields=[
                ('IDPartida', models.AutoField(primary_key=True, serialize=False)),
                ('FechaAlta', models.DateTimeField()),
                ('FechaBaja', models.DateTimeField(blank=True, null=True)),
                ('Subtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Retencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Total', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IsActiva', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'Partida',
            },
        ),
        migrations.CreateModel(
            name='RelacionFacturaxPartidas',
            fields=[
                ('IDRelacionFacturaxPartidas', models.AutoField(primary_key=True, serialize=False)),
                ('IDConcepto', models.IntegerField(default=0)),
                ('IDUsuarioAlta', models.IntegerField(default=0)),
                ('IDUsuarioBaja', models.IntegerField(default=0)),
                ('IDFacturaxCliente', models.ForeignKey(db_column='IDFacturaxCliente', on_delete=django.db.models.deletion.CASCADE, to='PendienteEnviar.FacturasxCliente')),
                ('IDPartida', models.ForeignKey(db_column='IDPartida', on_delete=django.db.models.deletion.CASCADE, to='PendienteEnviar.Partida')),
            ],
            options={
                'db_table': 'RelacionFacturaxPartidas',
            },
        ),
        migrations.CreateModel(
            name='Ext_PendienteEnviar_Costo',
            fields=[
                ('IDPendienteEnviar', models.OneToOneField(db_column='IDPendienteEnviar', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='PendienteEnviar.PendientesEnviar')),
                ('CostoSubtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('CostoIVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('CostoRetencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('CostoTotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IsFacturaProveedor', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'Ext_PendienteEnviar_Costo',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Ext_PendienteEnviar_Precio',
            fields=[
                ('IDPendienteEnviar', models.OneToOneField(db_column='IDPendienteEnviar', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='PendienteEnviar.PendientesEnviar')),
                ('PrecioSubtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioIVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioRetencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioTotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('PrecioServicios', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IsFacturaCliente', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'Ext_PendienteEnviar_Precio',
                'managed': False,
            },
        ),
    ]
