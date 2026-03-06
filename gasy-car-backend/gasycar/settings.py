import os
from pathlib import Path
from dotenv import load_dotenv

# Configuration JWT
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-gasycar-secret-key-2025"
DEBUG = os.getenv("DEBUG", True)

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "daphne",
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_yasg",
    "corsheaders",
    "users",
    "notification",
    "vehicule",
    "marketing",
    "reservations",
    "support.apps.SupportConfig",
    "reviews",
    "prestataire",
    "messaging",
    "payments",
    "blogs",
    "modepayment",
    "driver",
    "smsapp"
]


# Django REST Framework

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=15),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "gasycar.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "gasycar.wsgi.application"
ASGI_APPLICATION = "gasycar.asgi.application"


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'gasycar'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASS', 'lalaina14'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Indian/Antananarivo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
MEDIA_URL = "/media/"
if DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")
else:
    MEDIA_ROOT = "/app/media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://gasy-car-backend.onrender.com",
    "https://madagasycar.com",
    "https://www.madagasycar.com",
]

# Session Configuration
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_COOKIE_AGE = 3600 * 24 * 30  # 30 jours
SESSION_SAVE_EVERY_REQUEST = True

# CSRF Configuration
CSRF_USE_SESSIONS = False
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://gasy-car-backend.onrender.com",
    "https://madagasycar.com",
    "https://www.madagasycar.com",
]

# Custom User Model
AUTH_USER_MODEL = "users.User"

# Email configuration
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp-relay.brevo.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "9c6095001@smtp-brevo.com"
EMAIL_HOST_PASSWORD = "xsmtpsib-b22943aa7454a84f8000a55cb1643e2894f90e8239db6a4cfd71ae814b25964c-MFPJ4jngvMtiH7tA"
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
DEFAULT_FROM_EMAIL = "contact@madagasycar.com"

# EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST="smtp-relay.brevo.com"
# EMAIL_PORT=587
# EMAIL_HOST_USER="9c6095001@smtp-brevo.com"
# EMAIL_HOST_PASSWORD="xsmtpsib-b22943aa7454a84f8000a55cb1643e2894f90e8239db6a4cfd71ae814b25964c-5nU4CdACgDiPUfmL"
# EMAIL_USE_TLS=True
# EMAIL_USE_SSL=False
# DEFAULT_FROM_EMAIL="workshop@widea.center"


# Configuration OTP
OTP_VALIDITY_MINUTES = 10
OTP_LENGTH = 6

# Configuration email (déjà dans votre settings)
APPEND_SLASH = False

# Public base URL used in password-reset emails.
# Example: https://madagasycar.com
PASSWORD_RESET_BASE_URL = os.environ.get("PASSWORD_RESET_BASE_URL", "https://madagasycar.com")

# infor user

DEFAULT_ADMIN_EMAIL = os.environ.get("DEFAULT_ADMIN_EMAIL", "admin@gasysystem.com")
DEFAULT_ADMIN_PASSWORD = os.environ.get(
    "DEFAULT_ADMIN_PASSWORD", "AdminSuperSecret123!"
)
DEFAULT_ADMIN_FIRST_NAME = os.environ.get("DEFAULT_ADMIN_FIRST_NAME", "Super")
DEFAULT_ADMIN_LAST_NAME = os.environ.get("DEFAULT_ADMIN_LAST_NAME", "Admin")
