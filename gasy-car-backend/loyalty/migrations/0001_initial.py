# Generated manually for the loyalty module.
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LoyaltyTransaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('transaction_type', models.CharField(choices=[('RESERVATION_COMPLETED', 'Location terminée'), ('REVIEW_POSTED', 'Avis vérifié publié'), ('PROFILE_COMPLETED', 'Profil complété'), ('REFERRAL_PENDING', 'Parrainage en attente'), ('REDEEMED', 'Points utilisés'), ('MANUAL', 'Ajustement manuel')], max_length=40)),
                ('status', models.CharField(choices=[('EARNED', 'Gagné'), ('PENDING', 'En attente'), ('REDEEMED', 'Utilisé'), ('CANCELLED', 'Annulé')], default='EARNED', max_length=20)),
                ('source_type', models.CharField(choices=[('RESERVATION', 'Réservation'), ('REVIEW', 'Avis'), ('PROFILE', 'Profil'), ('REFERRAL', 'Parrainage'), ('MANUAL', 'Manuel')], default='MANUAL', max_length=20)),
                ('source_id', models.CharField(blank=True, default='', max_length=64)),
                ('label', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('points', models.IntegerField(default=0)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loyalty_transactions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'loyalty_transactions',
                'ordering': ('-created_at', '-updated_at'),
            },
        ),
        migrations.AddConstraint(
            model_name='loyaltytransaction',
            constraint=models.UniqueConstraint(fields=('user', 'source_type', 'source_id', 'transaction_type'), name='unique_loyalty_event_per_source'),
        ),
    ]
