from random import randint

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def message(request):
    r = randint(0,10000)
    return HttpResponse('{"message": "Test'+str(r)+' "}')
