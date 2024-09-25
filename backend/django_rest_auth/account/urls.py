from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenRefreshView

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register'),
    path('verify-email/', views.VerifyUserEmail.as_view(), name='verify-email'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('test-auth/', views.TestAuthetication.as_view(), name='test-auth'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('set-new-password/', views.SetNewPassword.as_view(), name='set-new-password'),
    path('password-reset-confirm/<uidb64>/<token>', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('logout/', views.LogoutUserView.as_view(), name='logout'),
]