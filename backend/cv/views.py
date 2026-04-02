from random import randint

from django.http import JsonResponse


def message(request):
    r = randint(0, 10000) + 1
    return JsonResponse({'message': f'Test{r}!'})
