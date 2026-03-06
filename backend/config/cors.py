from django.http import HttpResponse


class SimpleCORSMiddleware:
    """Minimal CORS middleware configured via CORS_ALLOW_ORIGINS env setting."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'OPTIONS':
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        origin = request.headers.get('Origin')
        from django.conf import settings
        allowed_origins = getattr(settings, 'CORS_ALLOW_ORIGINS', [])

        if origin and origin in allowed_origins:
            response['Access-Control-Allow-Origin'] = origin
            response['Vary'] = 'Origin'
            response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

        return response
