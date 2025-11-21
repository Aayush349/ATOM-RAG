
'''
def transcribe_audio(file_path):
    r = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio = r.record(source)
    return r.recognize_google(audio)
'''
# voice/transcriber.py
from pydub import AudioSegment
import speech_recognition as sr
import tempfile

def transcribe_audio(audio_file):
    recognizer = sr.Recognizer()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_wav:
        # Convert input audio (webm, etc.) to WAV
        audio = AudioSegment.from_file(audio_file)
        audio.export(tmp_wav.name, format="wav")

        with sr.AudioFile(tmp_wav.name) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
                return text
            except sr.UnknownValueError:
                return "Could not understand audio."
            except sr.RequestError as e:
                return f"API request error: {e}"
