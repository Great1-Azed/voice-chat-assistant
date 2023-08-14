from io import BytesIO
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from pydub import AudioSegment
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import tempfile
import os
from django.conf import settings 
import soundfile as sf


from core.logic import audio_to_text

# Create your views here.

def index(request):
    return  render(request, "realindex.html")


def mp3_to_flac(mp3_path, output_flac_path):
    audio = AudioSegment.from_mp3(mp3_path)
    temp_wav_path = 'temp.wav'
    audio.export(temp_wav_path, format='wav')
    pcm_audio, sample_rate = sf.read(temp_wav_path)
    sf.write(output_flac_path, pcm_audio, samplerate=sample_rate, subtype='FLAC')
    os.remove(temp_wav_path)

@csrf_exempt
def processAudio(request):
    try:
        if request.method == 'POST':
            audio_file = request.FILES.get('audio')

            # Determine the path to the "resources" folder
            resources_folder = os.path.join(settings.BASE_DIR, 'resources')

            # Create the folder if it doesn't exist
            if not os.path.exists(resources_folder):
                os.makedirs(resources_folder)

            # Save the uploaded MP3 file to the "resources" folder
            mp3_path = os.path.join(resources_folder, 'temp.mp3')
            with open(mp3_path, 'wb') as f:
                for chunk in audio_file.chunks():
                    f.write(chunk)

            # Convert the MP3 to FLAC
            flac_path = os.path.join(resources_folder, 'temp.flac')
            mp3_to_flac(mp3_path, flac_path)

            # You can now process the converted FLAC file
            text = audio_to_text('resources/temp.flac')
            print(text)
            
            # Load and play the MP3 file
            #mixer.music.load(mp3_path)
            #mixer.music.play()
    except Exception as e:
        print(e)

    


def processAudio1(request):
   if request.method == "POST":
      # Retrieve the audio data from the POST request
      audio_data = request.FILES.get("audio")
      # Process the audio data (e.g., save it to a file, analyze, etc.)
      # Here, we'll just print the size of the audio data
      if audio_data:
        # Load the audio blob using pydub
        audio_data = AudioSegment.from_file(BytesIO(audio_data.read()))
        flac_audio = audio_data.export(format="")
        text = audio_to_text(flac_audio)
        print("Text:_____:", text)
        return aboutUS(request)

def aboutUS(request):
   return render(request,'about_us.html')

def contactUS(request):
   return render(request,'contact_us.html')

def google(request):
    audio =request.POST.get("audio")
    text = audio_to_text(audio)
    if text:
      return HttpResponseRedirect("https://www.google.com")