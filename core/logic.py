import speech_recognition as sr

def audio_to_text(audio_file_path):
    recognizer = sr.Recognizer()

    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)  # Record the entire audio file

        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError as e:
            return f"Error connecting to Google Speech Recognition service: {e}"


