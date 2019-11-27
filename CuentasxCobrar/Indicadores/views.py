from django.shortcuts import render
from datetime import date

def Indicadores(request):
    today = date.today()
    return render(request, 'Indicadores.html', {'today': today})
