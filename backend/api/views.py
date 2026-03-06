import hashlib
import json
import secrets
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .default_data import DEFAULT_APP_DATA
from .models import AdminUser, ApiSession, Booking, Content

CURRENT_2FA_CODE = '123456'


def _ensure_seed_data():
    if not Content.objects.filter(key='main').exists():
        Content.objects.create(key='main', data=DEFAULT_APP_DATA)
    if not AdminUser.objects.filter(email='admin@widea.center').exists():
        pwd_hash = hashlib.sha256('admin123'.encode()).hexdigest()
        AdminUser.objects.create(email='admin@widea.center', password_hash=pwd_hash)


def _json_body(request):
    return json.loads(request.body.decode('utf-8') or '{}')


def _auth_token(request):
    header = request.headers.get('Authorization', '')
    if not header.startswith('Bearer '):
        return None
    return header.split(' ', 1)[1]


def _is_authorized(request):
    token = _auth_token(request)
    if not token:
        return False
    return ApiSession.objects.filter(token=token).exists()


@csrf_exempt
@require_http_methods(['POST'])
def login(request):
    _ensure_seed_data()
    payload = _json_body(request)
    email = payload.get('email', '')
    password = payload.get('password', '')

    user = AdminUser.objects.filter(email=email).first()
    if not user:
        return JsonResponse({'error': 'Invalid email or password'}, status=401)

    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if password_hash != user.password_hash:
        return JsonResponse({'error': 'Invalid password'}, status=401)

    return JsonResponse({'success': True, 'require2FA': True})


@csrf_exempt
@require_http_methods(['POST'])
def verify(request):
    payload = _json_body(request)
    code = payload.get('code', '')
    if code != CURRENT_2FA_CODE:
        return JsonResponse({'error': 'Invalid code'}, status=401)

    token = secrets.token_hex(16)
    ApiSession.objects.create(token=token)
    return JsonResponse({'success': True, 'token': token})


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def content(request):
    _ensure_seed_data()
    if request.method == 'GET':
        content_item = Content.objects.get(key='main')
        return JsonResponse(content_item.data)

    if not _is_authorized(request):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    payload = _json_body(request)
    content_item = Content.objects.get(key='main')
    content_item.data = payload
    content_item.save()
    return JsonResponse({'success': True})


@csrf_exempt
@require_http_methods(['POST'])
def book(request):
    payload = _json_body(request)
    booking = Booking.objects.create(
        name=payload.get('name', ''),
        email=payload.get('email', ''),
        date=payload.get('date', ''),
        time=payload.get('time', ''),
        topic=payload.get('topic', ''),
    )
    return JsonResponse({'success': True, 'id': booking.id})


@require_http_methods(['GET'])
def bookings(request):
    if not _is_authorized(request):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    all_bookings = Booking.objects.order_by('-created_at')
    payload = [
        {
            'id': str(item.id),
            'name': item.name,
            'email': item.email,
            'date': item.date,
            'time': item.time,
            'topic': item.topic,
            'createdAt': item.created_at.isoformat(),
        }
        for item in all_bookings
    ]
    return JsonResponse(payload, safe=False)


@csrf_exempt
@require_http_methods(['POST'])
def change_password(request):
    if not _is_authorized(request):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    payload = _json_body(request)
    email = payload.get('email', '')
    current_password = payload.get('currentPassword', '')
    new_password = payload.get('newPassword', '')

    user = AdminUser.objects.filter(email=email).first()
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)

    current_hash = hashlib.sha256(current_password.encode()).hexdigest()
    if current_hash != user.password_hash:
        return JsonResponse({'error': 'Invalid current password'}, status=401)

    user.password_hash = hashlib.sha256(new_password.encode()).hexdigest()
    user.save()
    return JsonResponse({'success': True})


@csrf_exempt
@require_http_methods(['POST'])
def upload(request):
    if not _is_authorized(request):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    upload_file = request.FILES.get('file')
    if not upload_file:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

    saved_path = default_storage.save(f'uploads/{upload_file.name}', upload_file)
    return JsonResponse({'url': f'/{saved_path}'})
