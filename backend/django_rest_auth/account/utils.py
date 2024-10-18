import random
from django.conf import settings
from django.core.mail import EmailMessage

from .models import User,OneTimePassword

def generate_otp():
    otp=""
    for i in range(6):
        otp+=str(random.randint(1,9))
    return otp

def send_otp_email(email):
    email_subject = 'One Time Password for Email Verification'
    otp_code= generate_otp()
    # print(otp_code)
    user = User.objects.get(email=email)
    current_site = "StockSaver.com"
    email_body= f"Hi, {user.first_name} thanks for signing up on {current_site}. Your OTP is {otp_code}. Please enter this OTP to verify your email address."
    from_email = settings.DEFAULT_FROM_EMAIL

    OneTimePassword.objects.create(user=user,code=otp_code)
    d_email = EmailMessage(
        email_subject, email_body, from_email, [email]
    )
    d_email.send(fail_silently=True)

def send_normal_email(data):
    email_subject = data['email_subject']
    email_body = data['email_body']
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = data['to_email']
    email = EmailMessage(
        email_subject, email_body, from_email, [to_email]
    )
    email.send(fail_silently=True)
 



#  Google sign in
from google.auth.transport import requests
from google.oauth2 import id_token
from django.conf import settings
from account.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
import random
import string

def generate_random_password(length=12):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(alphabet) for _ in range(length))
    return password

class Google:
    @staticmethod
    def validate(access_token):
        try:
            id_info = id_token.verify_oauth2_token(access_token, requests.Request())
            if "account.google.com" in id_info['iss']:
                return id_info
        except Exception as e:
            print(f"Error validating token: {e}")  # Log the error
            raise AuthenticationFailed('Authentication failed')

def login_social_user(email, password):
    user = authenticate(email=email, password=password)
    if user:
        user_tokens = user.token()
        return {
            'email': user.email,
            'full_name': user.get_full_name(),
            'access_token': user_tokens['access'],
            'refresh_token': user_tokens['refresh']
        }
    else:
        raise AuthenticationFailed('Invalid email or password')

def register_social_user(provider, email, first_name, last_name):
    user = User.objects.filter(email=email)
    if user.exists():
        if provider == user[0].auth_provider:
            result = login_social_user(email=email, password=user[0].password)
            return result
        else:
            raise AuthenticationFailed('Please continue your login using ' + user[0].auth_provider)
    else:
        new_user = {
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'password': generate_random_password(),
        }
        register_user = User.objects.create_user(**new_user)
        register_user.auth_provider = provider
        register_user.is_verified = True
        register_user.save()
        result = login_social_user(email=email, password=new_user['password'])
        return result