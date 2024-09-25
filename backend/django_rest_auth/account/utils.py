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
 