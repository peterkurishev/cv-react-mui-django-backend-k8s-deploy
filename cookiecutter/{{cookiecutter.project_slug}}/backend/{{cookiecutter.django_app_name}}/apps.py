from django.apps import AppConfig


class {{ cookiecutter.django_app_name | capitalize }}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = '{{ cookiecutter.django_app_name }}'
