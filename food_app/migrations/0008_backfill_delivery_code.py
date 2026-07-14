import secrets

from django.db import migrations


def generate_code():
    return "".join(str(secrets.randbelow(10)) for _ in range(6))


def backfill_delivery_codes(apps, schema_editor):
    Delivery = apps.get_model("food_app", "Delivery")
    for delivery in Delivery.objects.filter(delivery_code=""):
        delivery.delivery_code = generate_code()
        delivery.save(update_fields=["delivery_code"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("food_app", "0007_delivery_delivery_code"),
    ]

    operations = [
        migrations.RunPython(backfill_delivery_codes, noop_reverse),
    ]
