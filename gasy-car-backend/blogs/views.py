from .serializers import BlogPostSerializer
from .permissions import IsAdminOrReadOnly
# DRF
from rest_framework import viewsets, parsers

# django

# models
from .models import BlogPost



class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        qs = BlogPost.objects.all()

        user = self.request.user
        if user.is_staff or user.is_superuser or getattr(user, "role", None) == "ADMIN":
            return qs

        return qs.filter(is_published=True)
