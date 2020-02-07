from django.shortcuts import render


def GetReporteMaster(request):
	return render(request, 'ReporteMaster.html')
