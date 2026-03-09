import logging
from django.db.models.signals import pre_delete, pre_save, post_save
from django.dispatch import receiver
from .models import ReservationPayment
from gasycar.utils import delete_file

logger = logging.getLogger(__name__)

def _cleanup_old_file(instance, field_name: str, model_class):
    if not instance.pk:
        return

    try:
        previous = model_class.objects.get(pk=instance.pk)
    except model_class.DoesNotExist:
        return

    old_file = getattr(previous, field_name)
    new_file = getattr(instance, field_name)
    
    if old_file and old_file != new_file:
         if hasattr(old_file, 'url'):
             delete_file(old_file.url)
         elif hasattr(old_file, 'path'):
             delete_file(old_file.path)
         else:
             delete_file(str(old_file))

@receiver(pre_save, sender=ReservationPayment)
def reservationpayment_pre_save(sender, instance, **kwargs):
    _cleanup_old_file(instance, "proof_image", ReservationPayment)

@receiver(pre_delete, sender=ReservationPayment)
def reservationpayment_pre_delete(sender, instance, **kwargs):
    if instance.proof_image:
        if hasattr(instance.proof_image, 'url'):
             delete_file(instance.proof_image.url)
        elif hasattr(instance.proof_image, 'path'):
             delete_file(instance.proof_image.path)
        else:
             delete_file(str(instance.proof_image))

# --- NOTIFICATIONS SIGNAL ---
from reservations.models import Reservation
from notification.models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

@receiver(post_save, sender=Reservation)
def notify_reservation_creation(sender, instance, created, **kwargs):
    if created:
        # 1. Notify Client
        client_notif = Notification.objects.create(
            user=instance.client,
            notification_type=Notification.NotificationType.RESERVATION,
            title="Réservation en attente",
            body=f"Votre réservation {instance.reference} pour {instance.vehicle.titre} a été reçue et est en attente de validation.",
            reservation=instance
        )
        send_ws_notification(instance.client.id, client_notif)

        # 2. Notify Prestataire (Owner)
        # Assuming vehicle has a 'proprietaire' field
        if instance.vehicle.proprietaire:
            owner_notif = Notification.objects.create(
                user=instance.vehicle.proprietaire,
                notification_type=Notification.NotificationType.RESERVATION,
                title="Nouvelle réservation reçue",
                body=f"Nouvelle demande de réservation {instance.reference} pour votre véhicule {instance.vehicle.titre}.",
                reservation=instance
            )
            send_ws_notification(instance.vehicle.proprietaire.id, owner_notif)

def send_ws_notification(user_id, notification):
    channel_layer = get_channel_layer()
    group_name = f"user_{user_id}"
    
    # Payload matching what frontend expects
    message_data = {
        "id": str(notification.id),
        "title": notification.title,
        "body": notification.body,
        "type": notification.notification_type,
        "created_at": notification.created_at.isoformat(),
        "is_read": False,
        "reservation": str(notification.reservation.id) if notification.reservation else None
    }

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "notification_message",
            "message": message_data
        }
    )
