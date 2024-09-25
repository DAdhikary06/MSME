from rest_framework import serializers
from .utils import Google, register_social_user
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed



class GoogleSignInSerializer(serializers.Serializer):
    access_token = serializers.CharField()

    def validate_access_token(self, access_token):
        google_user_data=Google.validate(access_token)
        try:
            user_id=google_user_data['sub']

        except:
            raise serializers.ValidationError('Invalid token')
        
        if google_user_data['aud']!=settings.GOOGLE_CLIENT_ID:
            raise AuthenticationFailed(detail='Could not verify user')
        
        email=google_user_data['email']
        first_name=google_user_data['given_name']
        last_name=google_user_data['family_name']
        return register_social_user(provider='google',email=email,first_name=first_name,last_name=last_name)
      

