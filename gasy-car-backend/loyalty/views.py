from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication

from .serializers import LoyaltySummarySerializer, LoyaltyTransactionSerializer
from .services import LoyaltyService


class LoyaltySummaryView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Le payload est déjà entièrement normalisé par build_payload.
        # On le renvoie directement pour éviter toute re-sérialisation
        # inutile sur des blocs déjà préparés (history, stats, tiers, ...).
        payload = LoyaltySummarySerializer.build_payload(request.user)
        return Response(payload)


class LoyaltyHistoryView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = LoyaltyService.get_history(request.user)
        serializer = LoyaltyTransactionSerializer(history, many=True)
        return Response(serializer.data)


class LoyaltyTiersView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        points = LoyaltyService.get_available_points(request.user)
        return Response(LoyaltyService.serialize_tiers(points))
