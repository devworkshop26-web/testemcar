from django.urls import path

from . import views

urlpatterns = [
    path("me/summary/", views.LoyaltySummaryView.as_view(), name="loyalty-summary"),
    path("me/history/", views.LoyaltyHistoryView.as_view(), name="loyalty-history"),
    path("tiers/", views.LoyaltyTiersView.as_view(), name="loyalty-tiers"),
]
