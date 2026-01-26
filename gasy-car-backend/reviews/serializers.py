# apps/reviews/serializers.py
from rest_framework import serializers
from .models import Review


from django.contrib.auth import get_user_model

User = get_user_model()


class ReviewAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    author_details = ReviewAuthorSerializer(source="author", read_only=True)

    class Meta:
        model = Review
        fields = "__all__"
