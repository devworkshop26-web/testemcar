from rest_framework.routers import DefaultRouter
from django.urls import path,include
from . import views
# marketing hero viewsets
router = DefaultRouter()
router.register(r'support-tickets', views.SupportTicketViewSet, basename='supportticket')
router.register(r'tickets-message', views.TicketMessagetViewSet, basename='TicketMessagetViewSet')

urlpatterns = [
    path('', include(router.urls)),
    
]