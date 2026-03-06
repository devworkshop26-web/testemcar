from django.db import models


class Content(models.Model):
    key = models.CharField(max_length=50, unique=True)
    data = models.JSONField(default=dict)


class Booking(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    date = models.CharField(max_length=50)
    time = models.CharField(max_length=50)
    topic = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class AdminUser(models.Model):
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)


class ApiSession(models.Model):
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
