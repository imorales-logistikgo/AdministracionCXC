from django import forms

class FacturaForm(forms.Form):
	FolioFactura = forms.CharField(max_length=50)
	Cliente = forms.CharField(max_length=100)
	FechaFactura = forms.DateTimeField()
	FechaRevision = forms.DateTimeField()
	FechaVencimiento = forms.DateTimeField()
	Moneda = forms.CharField(max_length=10)
	Subtotal = forms.DecimalField(max_digits=30, decimal_places=5)
	IVA = forms.DecimalField(max_digits=30, decimal_places=5)
	Retencion = forms.DecimalField(max_digits=30, decimal_places=5)
	Total = forms.DecimalField(max_digits=30, decimal_places=5)
	RutaXML = forms.CharField(max_length=300)
	RutaPDF = forms.CharField(max_length=300)
	TipoCambio = forms.DecimalField(max_digits=10, decimal_places=5)
	Comentarios = forms.CharField(max_length=500)