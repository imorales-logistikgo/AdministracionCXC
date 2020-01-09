from PendienteEnviar.models import View_PendientesEnviarCxC
from django.shortcuts import render
from datetime import date
from django.contrib.auth.decorators import login_required
@login_required

def Indicadores(request):
    today = date.today()
    return render(request, 'Indicadores.html', {'today': today})



def GetIndicadores(request):
	Indicadores = []
	# FinalizadosEvidencias = View_PendientesEnviarCxC.objects.filter(Status = 'FINALIZADO', IsEvidenciaDigital = True, IsEvidenciaFisica = True)
	# for FINALIZADO in FinalizadosEvidencias:
	# 	if FINALIZADO.NombreCortoCliente not in Indicadores:
	# 		Indicadores.append({FINALIZADO.NombreCortoCliente: 0});
	# 	Indicadores[FINALIZADO.NombreCortoCliente]++
	# breakpoint()
	return render('')
