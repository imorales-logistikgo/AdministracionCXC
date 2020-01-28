from django.conf import settings
from django.contrib.auth.hashers import check_password
from users import models as User
from usersadmon import models as Admon
import base64, hashlib
from django.utils.crypto import pbkdf2
import requests
import json
class EmailBackend():
    """
    Custom Email Backend to perform authentication via email
    """

    
    def authenticate(self, request, username=None, password=None):
        nombreusuario=username
        data = {
              "strPassword": password,
              "strCorreo": nombreusuario
        }
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        data_json = json.dumps(data)
        response = requests.post('http://api-admon.logistikgo.com/api/Usuarios/Encripta',data=data_json,headers=headers)
        respuesta = response.json()
        if respuesta:
            try:
                admonusers=Admon.AdmonUsuarios.objects.get(nombreusuario=nombreusuario) 
            except Admon.AdmonUsuarios.DoesNotExist:
                return None
            try:
                user = User.User.objects.get(username=nombreusuario)
            except User.User.DoesNotExist:

                user = User.User(username=nombreusuario)
                user.name = admonusers.nombre+" "+admonusers.apepaterno+" "+admonusers.apematerno
                user.email = admonusers.correo
                user.idusuario = admonusers.idusuario
                user.is_staff = True
                user.save()
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.User.objects.get(pk=user_id)
        except User.User.DoesNotExist:
            return None
