import speech_recognition as sr
import os

def transcribe_audio():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = r.listen(source, timeout=5)
    text = r.recognize_google(audio)
    return text
