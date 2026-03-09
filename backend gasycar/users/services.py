from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
import string
from .models import OTPCode, User, RefreshToken
from gasycar.utils import send_email_notification

class OTPService:
    @staticmethod
    def generate_otp_code(length=6):
        return ''.join(random.choices(string.digits, k=length))
    
    @staticmethod
    def create_otp(user, purpose):
        # CORRECTION : Invalider tous les anciens OTP
        OTPCode.objects.filter(
            user=user, 
            purpose=purpose, 
        ).delete()
        
        code = OTPService.generate_otp_code()
        expires_at = timezone.now() + timedelta(minutes=10)
        
        otp = OTPCode.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=expires_at
        )
        return otp
    
    @staticmethod
    def verify_otp(email, code, purpose):
        try:
            user = User.objects.get(email=email)
            # CORRECTION : Chercher sans filtre de date
            otp = OTPCode.objects.filter(
                user=user,
                # code=code,
                # purpose=purpose,
                is_used=False
            ).first()
                        
            # CORRECTION : Utiliser la méthode is_valid()
            if otp and otp.is_valid():
                otp.is_used = True
                otp.save()
                return user
            else:
                return None
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def send_otp_email(user, otp_code, purpose):
        if purpose == 'email_verification':
            from gasycar.utils import create_and_send_email_otp_standalone
            create_and_send_email_otp_standalone(user)
        else:  # password_reset
            subject = 'Réinitialisation de votre mot de passe - GasyCar'
            html_message = render_to_string(
                "password_reset_otp.html",
                { 
                    "OTP_CODE": otp_code,
                    "FIRST_NAME": user.first_name,
                    "YEAR": timezone.now().year
                },
            )
            send_email_notification(html_message, user.email, subject, is_html=True)

class TokenService:
    @staticmethod
    def create_refresh_token(user, token):
        expires_at = timezone.now() + timedelta(days=7)
        refresh_token = RefreshToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        return refresh_token
    
    @staticmethod
    def blacklist_refresh_token(token):
        try:
            refresh_token = RefreshToken.objects.get(token=token)
            refresh_token.is_blacklisted = True
            refresh_token.save()
            return True
        except RefreshToken.DoesNotExist:
            return False
    
    @staticmethod
    def is_refresh_token_valid(token):
        try:
            refresh_token = RefreshToken.objects.get(token=token)
            return refresh_token.is_valid()
        except RefreshToken.DoesNotExist:
            return False