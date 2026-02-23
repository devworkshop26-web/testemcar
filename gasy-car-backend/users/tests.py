from unittest.mock import patch

from django.test import TestCase

from users.models import User, OTPCode
from users.services import OTPService


class OTPServiceEmailVerificationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
            role="CLIENT",
        )

    @patch("users.services.send_email_notification")
    def test_send_email_verification_otp_does_not_generate_second_code(self, send_email_mock):
        otp = OTPService.create_otp(self.user, "email_verification")

        OTPService.send_otp_email(self.user, otp.code, "email_verification")

        self.assertEqual(
            OTPCode.objects.filter(user=self.user, purpose="email_verification").count(),
            1,
        )
        self.assertTrue(
            OTPCode.objects.filter(
                user=self.user,
                purpose="email_verification",
                code=otp.code,
            ).exists()
        )
        send_email_mock.assert_called_once()

    @patch("users.services.send_email_notification")
    def test_send_password_reset_otp_uses_provided_code(self, send_email_mock):
        OTPService.send_otp_email(self.user, "123456", "password_reset")

        send_email_mock.assert_called_once()
        args, kwargs = send_email_mock.call_args
        self.assertIn("123456", args[0])
        self.assertEqual(args[1], self.user.email)
        self.assertIn("Réinitialisation", args[2])
        self.assertTrue(kwargs["is_html"])
