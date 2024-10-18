from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_str,smart_bytes
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from .utils import send_normal_email
from rest_framework_simplejwt.tokens import RefreshToken,TokenError



class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password2 = serializers.CharField(max_length=68, min_length=6, write_only=True)

    class Meta:
        model=User
        fields=['email', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
       password = attrs.get('password', '')
       password2 = attrs.get('password2', '')
       if password != password2:
           raise serializers.ValidationError({"password": "Password fields didn't match"})
       return attrs
    
    def create(self, validated_data):
        user=User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model=User
        fields=['email', 'password', 'full_name', 'access_token', 'refresh_token']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        request = self.context.get('request')
        user = authenticate(request, email=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        if not user.is_verified:
            raise AuthenticationFailed('Email is not verified')
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        return {
            'email': user.email,
            'full_name': f"{user.first_name} {user.last_name}",
            'access_token': str(access_token),
            'refresh_token': str(refresh_token)
        }
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    
    class Meta:
        fields=['email']
        
    def validate(self, attrs):
        email = attrs.get('email', '')
        if User.objects.filter(email=email).exists():
            user=User.objects.get(email=email)
            uidb64=urlsafe_base64_encode(smart_bytes(user.id))
            token=PasswordResetTokenGenerator().make_token(user)
            request=self.context.get('request')
            # site_domain=get_current_site(request).domain
            site_domain = 'localhost:5173' 
            relative_link=reverse('password-reset-confirm', kwargs={'uidb64':uidb64, 'token':token})
            relative_link = relative_link.replace('account/', '', 1)  # Update the relative_link to remove the 'account/' prefix
            abslink = f"http://{site_domain}{relative_link}"
            email_body=f"Hi user, click on the link below to reset your password.\n{abslink}"
            data = {
                'email_body': email_body,
                'to_email': user.email,
                'email_subject': 'Reset your password'
            }
            send_normal_email(data)
            return super().validate(attrs)
        

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    confirm_password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    uidb64 = serializers.CharField(max_length=255)
    token = serializers.CharField(max_length=255)

    class Meta:
        fields=['password', 'confirm_password', 'uidb64', 'token']
    
    def validate(self, attrs):
        try:
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            password = attrs.get('password')
            confirm_password = attrs.get('confirm_password')
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)
            if password != confirm_password:
                raise AuthenticationFailed('Passwords do not match', 401)
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        

class LogoutUserSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
    default_error_messages = {
        'bad_token': ('Token is invalid or expired')
    }


    def validate(self, attrs):
        self.token = attrs.get('refresh_token')
        return attrs
    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            return self.fail('bad_token')




# Google sign in

from rest_framework import serializers
from .utils import Google, register_social_user
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
class GoogleSignInSerializer(serializers.Serializer):
    access_token = serializers.CharField()

    def validate(self, data):
        access_token = data.get('access_token')
        google_user_data = Google.validate(access_token)
        try:
            google_user_data['sub']
        except:
            raise serializers.ValidationError('Invalid token')
        print(google_user_data['aud'])

        if google_user_data['aud'] != settings.GOOGLE_CLIENT_ID:
            raise AuthenticationFailed(detail='Could not verify user')
        
        user_id = google_user_data['sub']
        email = google_user_data['email']
        first_name = google_user_data['given_name']
        last_name = google_user_data['family_name']
        provider = 'google'

        return register_social_user(provider=provider, user_id=user_id, email=email, first_name=first_name, last_name=last_name)



