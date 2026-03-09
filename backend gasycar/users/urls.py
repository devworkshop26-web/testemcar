from django.urls import path

from users import views

urlpatterns = [
    # Authentification
    path("register-with-otp/", views.UserRegistrationView.as_view(), name="register"),
    path("register/", views.WithOutUserRegistrationView.as_view(), name="register"),
    path("login/", views.UserLoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path(
        "token/refresh/", views.CustomTokenRefreshView.as_view(), name="token_refresh"
    ),
    # Profil utilisateur
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path("profile/<str:user_id>/", views.UserProfileView.as_view(), name="profile-update"),
    path("profile/<uuid:user_id>/photo/", views.UserProfilePhotoView.as_view(), name="profile-update-photo"),


    # user signup
    path("signup/", views.signup, name="signup"),
    # OTP et mots de passe
    path("otp/request/", views.OTPRequestView.as_view(), name="otp_request"),
    path("otp/verify/", views.OTPVerifyView.as_view(), name="otp_verify"),
    
    # password
    path("password/reset/", views.PasswordResetView.as_view(), name="password_reset"),
    path(
        "password/change/", views.ChangePasswordView.as_view(), name="password_change"
    ),
    # mot de passe oublie
    path("request-reset-password", views.RequestResetPasswordView.as_view(), name="request_reset_password"),
    path("reset-password/<str:uidb64>/<str:token>", views.reset_password, name="reset_password"),
    # users routs
    path("users-all/", views.UserListView.as_view(), name="user_list"),
    path("delete-non-admin/", views.DeleteNonAdminUsersView.as_view(), name="delete_non_admin_users"),
    # Backward compatible alias for older clients still calling /users/delete-non-admin/
    path("users/delete-non-admin/", views.DeleteNonAdminUsersView.as_view(), name="delete_non_admin_users_legacy"),
    path(
        "users-prestataire/", views.get_prestataire_users, name="get_prestataire_users"
    ),
    path("users-client/", views.get_client_users, name="get_client_users"),
    path("users-support/", views.get_support_users, name="get_support_users"),
    # get user info by token
    path("user-info/", views.UserInfoView.as_view(), name="user_info"),
]
