from .serializers import BlogPostSerializer
from .permissions import IsAdminOrReadOnly
# DRF
from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from rest_framework import viewsets, parsers
from rest_framework.response import Response
from rest_framework import status

# django
from django.core.files.storage import default_storage

# models
from .models import BlogPost
from .models import BlogPost

# serialser
from .serializers import BlogPostSerializer



class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Lecture pour tout le monde, écriture seulement pour staff/admin.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        qs = BlogPost.objects.all()

        if self.request.user.is_staff:
            return qs

        return qs.filter(is_published=True)
