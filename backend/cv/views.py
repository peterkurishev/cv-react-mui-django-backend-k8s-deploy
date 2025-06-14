from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def message(request):
    return HttpResponse('{"message": "Test123"}')
