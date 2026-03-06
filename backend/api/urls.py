from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login),
    path('verify', views.verify),
    path('content', views.content),
    path('book', views.book),
    path('bookings', views.bookings),
    path('change-password', views.change_password),
    path('upload', views.upload),
]
