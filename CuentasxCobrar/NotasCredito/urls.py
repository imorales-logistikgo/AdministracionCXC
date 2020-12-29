from django.urls import path
from . import views

urlpatterns = [
    path("", views.NotaCredito, name='NotasCredito'),
    path("FilesNotasCredito", views.FilesNotasCredito, name="FilesNotasCredito"),
    path("SaveNotaCredito", views.SaveNotaCredito, name="SaveNotaCredito")
]
