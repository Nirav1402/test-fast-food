from django.apps import AppConfig


class FoodAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'food_app'

    def ready(self):
        import food_app.signals  # noqa: F401
