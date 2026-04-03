from random import randint

from django.http import JsonResponse


def {{ cookiecutter.api_endpoint }}(request):
    r = randint(0, 10000) + 1
    return JsonResponse({'{{ cookiecutter.api_endpoint }}': f'Hello from {{ cookiecutter.project_name }}! #{r}'})
