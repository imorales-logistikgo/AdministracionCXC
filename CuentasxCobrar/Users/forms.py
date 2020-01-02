from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User
 
class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Correo'}),
            'password': forms.TextInput(attrs={'placeholder': 'Contraseña'})
        }
        fields = ('email',)
        
class UserLoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(
        attrs={
        'class':'form-control',
        'placeholder':'Username'
        }
    ))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={
        'class':'form-control',
        'placeholder':'Password'
        }
    ))