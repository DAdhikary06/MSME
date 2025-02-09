from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from .models import OneTimePassword, User
from . serializers import UserRegisterSerializer ,LoginSerializer,PasswordResetRequestSerializer, SetNewPasswordSerializer, LogoutUserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from . utils import send_otp_email
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

# Create your views here.

class RegisterUserView(GenericAPIView):
    serializer_class = UserRegisterSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = serializer.data
            send_otp_email(user['email']) # This line is added to send OTP to the user's email
            return Response({
                'data': user,
                "message": f" Hi {user}  registered successfully.Please verify your email"},status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)  
    

class VerifyUserEmail(GenericAPIView):
    def post(self, request):
       otpcode=request.data['otp']
       try:
           user_code_obj = OneTimePassword.objects.get(code=otpcode)
           user =user_code_obj.user
           if not user.is_verified:
                user.is_verified = True
                user.save()
                # user_code_obj.delete()
                return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
           return Response({'message': 'Email already verified'}, status=status.HTTP_204_NO_CONTENT)
       except OneTimePassword.DoesNotExist:
           return Response({'message': 'Invalid OTP. Please check your OTP'}, status=status.HTTP_400_BAD_REQUEST)
       
class LoginView(GenericAPIView):
    serializer_class = LoginSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TestAuthetication(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'message': 'You are authenticated'}, status=status.HTTP_200_OK)
    
class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data,context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password reset link has been sent to your email'}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(GenericAPIView):
    def get(self, request, uidb64, token):
       try:
           id = smart_str(urlsafe_base64_decode(uidb64))
           user = User.objects.get(id=id)
           if not PasswordResetTokenGenerator().check_token(user, token):
               return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)
           return Response({'message': 'Credentials valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)
       except DjangoUnicodeDecodeError:
            return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)
       
class SetNewPassword(GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password reset success'}, status=status.HTTP_200_OK)
    
# class LogoutUserView(GenericAPIView):
#     serializer_class=LogoutUserSerializer
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response({'message': 'Logout success'}, status=status.HTTP_200_OK)

class LogoutUserView(GenericAPIView):
    serializer_class=LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)

   