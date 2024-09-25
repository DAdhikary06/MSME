from google.auth.transport import requests
from google.oauth2 import id_token
from django.conf import settings
from account.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed


class Google:
    @staticmethod
    def validate(auth_token):
        try:
            id_info = id_token.verify_oauth2_token(auth_token, requests.Request())
            if "account.google.com" in id_info['iss']:
                return id_info
        except Exception as e:
            raise AuthenticationFailed('Authentication failed')
def login_social_user(email,password):
    user=authenticate(email=email,password=password)
    user_tokens=user.token()
    return {
        'email':user.email,
        'full_name':user.get_full_name,
        'access_token':user_tokens['access'],
        'refresh_token':user_tokens['refresh']
    }

def register_social_user(provider,email,first_name,last_name):
    user = User.objects.filter(email=email)
    if user.exists():
        if provider == user[0].auth_provider:
            login_social_user(email=email,password=settings.SOCIAL_AUTH_PASSWORD)
        else:
            raise AuthenticationFailed('Please continue your login using '+user[0].auth_provider)
    else:
        new_user={
            'email':email,
            'first_name':first_name,
            'last_name':last_name,
            'password':settings.SOCIAL_AUTH_PASSWORD,
        }
        register_user=User.objects.create_user(**new_user)
        register_user.auth_provider=provider
        register_user.is_verified=True
        register_user.save()
        login_social_user(email=email,password=settings.SOCIAL_AUTH_PASSWORD)


