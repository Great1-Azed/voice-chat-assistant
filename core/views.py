from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from core.logic.logic import audio_to_text

# Create your views here.

def index(request):
    
    return  HttpResponse("Hello World")


def google(request):
    audio =request.POST.get("audio")
    text = audio_to_text(audio)
    if text:
      return HttpResponseRedirect("https://www.google.com")