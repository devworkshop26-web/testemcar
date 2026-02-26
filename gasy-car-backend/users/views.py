# DRF
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken  # Correction ici
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from django.conf import settings
from rest_framework.permissions import AllowAny
import jwt
from jwt.exceptions import ExpiredSignatureError
from drf_yasg import openapi
from rest_framework.decorators import action

# DRF
from gasycar.utils import send_email_notification

# django
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
from django.template.loader import render_to_string
from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


from rest_framework_simplejwt.views import TokenRefreshView

# models
from .models import OTPCode

from .models import User

# serailisers
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    AdminUserUpdateSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordResetSerializer,
    ChangePasswordSerializer,
    CustomTokenRefreshSerializer,
    UserPhotoUploadSerializer
)
from .services import OTPService, TokenService


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Générer et envoyer OTP pour vérification email
            otp = OTPService.create_otp(user, "email_verification")
            OTPService.send_otp_email(user, otp.code, "email_verification")

            return Response(
                {
                    "message": "Compte créé avec succès. Un code de vérification a été envoyé à votre email.",
                    "id": str(user.id),
                    "email": str(user.email),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WithOutUserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            return Response(
                UserProfileSerializer(user).data, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email et mot de passe requis."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"detail": "verifier votre email ou mot de passe."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "Compte inactif."}, status=status.HTTP_403_FORBIDDEN)
        
         # CORRECTION : Vérifier si l'email est vérifié
        if not user.email_verified:
            return Response(
                {'detail': 'Veuillez vérifier votre email avant de vous connecter.'},
                status=status.HTTP_400_BAD_REQUEST
                )

   
        # Génération JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Sérialisation légère
        user_data = UserProfileSerializer(user).data

        return Response({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user_data,
        }, status=status.HTTP_200_OK)


class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            purpose = serializer.validated_data["purpose"]

            try:
                user = User.objects.get(email=email)
                otp = OTPService.create_otp(user, purpose)
                OTPService.send_otp_email(user, otp.code, purpose)

                return Response(
                    {"message": f"Code {purpose} envoyé avec succès."},
                    status=status.HTTP_200_OK,
                )

            except User.DoesNotExist:
                return Response(
                    {"error": "Aucun utilisateur avec cet email."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            code = serializer.validated_data["code"]
            purpose = serializer.validated_data["purpose"]
            user = User.objects.get(email=email)
            print("code====",code)
        
            otp = OTPCode.objects.filter(user=user, code=code, purpose=purpose, is_used=False).order_by('-created_at').first()
            print("otp====",otp.code if otp else None)

            if otp:
                otp.is_used = True
                otp.save()
                
                response_data = {
                    "message": "Vérification réussie.",
                    "verified": True
                }

                if purpose == "email_verification":
                    user.email_verified = True
                    user.is_active = True
                    user.save()
                    
                    refresh = RefreshToken.for_user(user)
                    response_data.update({
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh),
                        "user_id": user.id,
                        "email": user.email,
                        "role": user.role,
                    })

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Code invalide ou expiré.", "verified": False},
                    status=status.HTTP_400_BAD_REQUEST,
                )



        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            code = serializer.validated_data["code"]
            new_password = serializer.validated_data["new_password"]

            user = OTPService.verify_otp(email, code, "password_reset")
            if user:
                user.set_password(new_password)
                user.save()

                return Response(
                    {"message": "Mot de passe réinitialisé avec succès."},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Code invalide ou expiré."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]

            if not user.check_password(old_password):
                return Response(
                    {"error": "Ancien mot de passe incorrect."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Mot de passe modifié avec succès."},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshAllView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response(
                {"error": "Refresh token requis."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier si le refresh token est valide
        if not TokenService.is_refresh_token_valid(refresh_token):
            return Response(
                {"error": "Refresh token invalide ou expiré."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)  # Correction ici
            user_id = refresh["user_id"]
            user = User.objects.get(id=user_id)

            # Générer de nouveaux tokens
            new_refresh = RefreshToken.for_user(user)  # Correction ici
            new_access_token = str(new_refresh.access_token)
            new_refresh_token = str(new_refresh)

            # Blacklist l'ancien token et stocker le nouveau
            TokenService.blacklist_refresh_token(refresh_token)
            TokenService.create_refresh_token(user, new_refresh_token)

            return Response(
                {"access_token": new_access_token, "refresh_token": new_refresh_token},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": "Token invalide."}, status=status.HTTP_401_UNAUTHORIZED
            )


# refresh token view
class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):

        # Récupérer les tokens générés par le super()
        response = super().finalize_response(request, response, *args, **kwargs)
        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if refresh_token:
            TokenService.blacklist_refresh_token(refresh_token)

        return Response({"message": "Déconnexion réussie."}, status=status.HTTP_200_OK)


# get all Users (for admin purposes)
class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all().order_by("-date_joined")
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)


class DeleteNonAdminUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_user = request.user

        if current_user.role != "ADMIN" and not current_user.is_superuser:
            return Response(
                {"detail": "Accès réservé aux administrateurs."},
                status=status.HTTP_403_FORBIDDEN,
            )

        password = request.data.get("password")
        if not password:
            return Response(
                {"detail": "Le mot de passe administrateur est requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not current_user.check_password(password):
            return Response(
                {"detail": "Mot de passe administrateur invalide."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        deleted_count, _ = User.objects.exclude(role="ADMIN").delete()

        return Response(
            {
                "message": "Suppression en masse terminée.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )


# signup User endpoint for testing
@api_view(["POST"])
def signup(request):
    email = request.data.get("email")
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    if (
        request.data.get("email") is None
        or request.data.get("password") is None
        or request.data.get("first_name") is None
        or request.data.get("last_name") is None
    ):
        return Response(
            {"error": "All input is request"}, status=status.HTTP_400_BAD_REQUEST
        )

    # create user
    user = User.objects.create_user(
        email=request.data["email"],
        password=request.data["password"],
        first_name=request.data["first_name"],
        last_name=request.data["last_name"],
        role=request.data["role"],
    )

    if request.data.get("phone"):
        user.phone = request.data.get("phone")

    # save into database
    user.save()

    serializer = UserProfileSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# api view get all user with role prestataire et add swagger
@swagger_auto_schema(method="get", operation_description="Get all prestataire users")
@api_view(["GET"])
def get_prestataire_users(request):
    prestataire_users = User.objects.filter(role="PRESTATAIRE")
    serializer = UserProfileSerializer(prestataire_users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(method="get", operation_description="Get all client users")
@api_view(["GET"])
def get_client_users(request):
    client_users = User.objects.filter(role="CLIENT")
    serializer = UserProfileSerializer(client_users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# api view get all user with role support
@swagger_auto_schema(method="get", operation_description="Get all support users")
@api_view(["GET"])
def get_support_users(request):
    support_users = User.objects.filter(role="SUPPORT")
    serializer = UserProfileSerializer(support_users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_user(self, request, user_id=None):
        """
        - Si user_id est None -> retourne l'utilisateur connecté (profile/)
        - Sinon -> retourne l'utilisateur avec cet ID (pour un usage admin par ex)
        """
        print("user_id========", user_id)

        return get_object_or_404(User, id=user_id)

    # ───────────────────── GET ─────────────────────
    @swagger_auto_schema(
        operation_description=(
            "Récupère le profil de l'utilisateur connecté si aucun ID n'est fourni, "
            "ou le profil d'un utilisateur spécifique via son ID (pour les admins)."
        ),
       
        responses={200: UserProfileSerializer, 404: "User not found"},
    )
    def get(self, request, user_id=None):
        user = self.get_user(request, user_id)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ───────────────────── PUT ─────────────────────
    @swagger_auto_schema(
        operation_description=(
            "Met à jour le profil de l'utilisateur connecté, "
            "ou d'un utilisateur donné par ID (réservé aux admins)."
        ),
        request_body=UserUpdateSerializer,
        responses={200: UserUpdateSerializer, 400: "Bad Request", 403: "Forbidden", 404: "User not found"},
    )
    def put(self, request, user_id=None):
        user = self.get_user(request, user_id)

        current_user = request.user
        is_admin_edit = (
            user_id is not None
            and (current_user.role == "ADMIN" or current_user.is_superuser)
            and str(current_user.id) != str(user.id)
        )

        serializer_class = AdminUserUpdateSerializer if is_admin_edit else UserUpdateSerializer
        serializer = serializer_class(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ───────────────────── DELETE ─────────────────────
    @swagger_auto_schema(
        operation_description=(
            "Supprime le compte de l'utilisateur connecté ou d’un utilisateur "
            "par ID (réservé aux admins)."
        ),
        responses={204: "Deleted", 403: "Forbidden", 404: "User not found"},
    )
    def delete(self, request, user_id=None):
        user = self.get_user(request, user_id)

        if user_id is not None:
            current_user = request.user

            if current_user.role != "ADMIN" and not current_user.is_superuser:
                return Response(
                    {"detail": "Accès réservé aux administrateurs."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            password = request.data.get("password")
            if not password:
                return Response(
                    {"detail": "Le mot de passe administrateur est requis."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not current_user.check_password(password):
                return Response(
                    {"detail": "Mot de passe administrateur invalide."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

class UserInfoView(APIView):
    """
    Retourne les informations de l'utilisateur connecté via son token d'accès.
    Utilise l'authentification standard de DRF (request.user est peuplé par SimpleJWT).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class RequestResetPasswordView(APIView):
    # throttle_classes = [ResetPasswordRateThrottle]
    permission_classes = [AllowAny]
    authentication_classes = [] 
    
    
    @method_decorator(csrf_exempt)  # Bypass CsrfViewMiddleware pour être 100% safe côté Django
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({'error': 'email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if user:
            token = PasswordResetTokenGenerator().make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            reset_path = reverse('reset_password', kwargs={'uidb64': uidb64, 'token': token})

            configured_base_url = getattr(settings, "PASSWORD_RESET_BASE_URL", "").rstrip("/")
            if configured_base_url:
                reset_link = f"{configured_base_url}{reset_path}"
            else:
                reset_link = request.build_absolute_uri(reset_path)
                if settings.DEBUG is False and reset_link.startswith("http://"):
                    reset_link = reset_link.replace("http://", "https://", 1)

            # send email
            subject = "Réinitialisation de mot de passe"
            html_message = render_to_string(
                "password_reset_email.html",
                { "reset_link": reset_link},
            )
            # send
            send_email_notification(html_message, email, subject)


            return Response(
                {'message': 'Un email de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.'},
                status=status.HTTP_202_ACCEPTED,
            )
        else:
            return Response(
                {'message': 'Votre compte n\'existe pas. vérifiez votre email'},
                status=status.HTTP_202_ACCEPTED,
            )


def reset_password(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    is_token_valid = user is not None and PasswordResetTokenGenerator().check_token(user, token)

    if request.method == "GET":
        if not is_token_valid:
            return render(
                request,
                "reset_password.html",
                {"error": "Le lien de réinitialisation est invalide ou expiré."},
            )

        return render(request, "reset_password.html")

    if request.method == "POST":
        password = request.POST.get("password")
        password2 = request.POST.get("password2")

        if not is_token_valid:
            return render(
                request,
                "reset_password.html",
                {"error": "Le lien de réinitialisation est invalide ou expiré."},
            )

        if not password or not password2:
            return render(
                request,
                "reset_password.html",
                {"error": "Veuillez remplir les deux champs mot de passe."},
            )

        if password != password2:
            return render(
                request,
                "reset_password.html",
                {"error": "Les mots de passe ne correspondent pas."},
            )

        user.set_password(password)
        user.save()
        return render(request, "password_reset_success.html")

    return render(
        request,
        "reset_password.html",
        {"error": "Méthode non autorisée pour cette opération."},
    )




class UserProfilePhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # ⇐ important pour les uploads


    # ───────────────────── UPLOAD PHOTO ─────────────────────
    @swagger_auto_schema(
        operation_description="Upload / change la photo de profil de l'utilisateur",
        request_body=UserPhotoUploadSerializer,
        responses={200: "Photo uploaded", 400: "Invalid image"}
    )
    @action(detail=False, methods=["post"], url_path="photo")
    def upload_photo(self, request, user_id=None):
        user = self.get_user(request, user_id)

        serializer = UserPhotoUploadSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Photo mise à jour avec succès",
                "photo_url": user.image.url if user.image else None,
            },
            status=status.HTTP_200_OK,
        )
