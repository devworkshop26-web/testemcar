from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json


#  notification
class NotificationConsumer(WebsocketConsumer):
    room_group_name = None

    def connect(self):
        # 🔥 AJOUT NECESSAIRE : récupérer l'utilisateur authentifié
        user = self.scope["user"]

        # 🔒 Sécurité : refuser si non authentifié
        if not user or not user.is_authenticated:
            self.close()
            return

        # 🔥 IMPORTANT : groupe DOIT correspondre à signals.py (user_<id>)
        self.room_group_name = f"user_{user.id}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group only if the connection joined one
        if self.room_group_name:
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name, self.channel_name
            )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {"type": "notification_message", "message": message}
        )

    # Receive message from room group
    def notification_message(self, event):
        message = event["message"]
        # Envoyer le dictionnaire JSON via WebSocket
        self.send(text_data=json.dumps(message))
