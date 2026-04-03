from django.contrib import admin
from django.urls import path
from {{ cookiecutter.django_app_name }}.views import {{ cookiecutter.api_endpoint }}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('{{ cookiecutter.api_prefix }}/{{ cookiecutter.api_endpoint }}', {{ cookiecutter.api_endpoint }}),
]
