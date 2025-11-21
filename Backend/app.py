from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from config import get_answer_from_openrouter


# Import your utils (rag logic and voice transcription)
from rag_logic.processor import process_document    
from rag_logic.utils.rag import process_pdf
from voice.transcriber import transcribe_audio


load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200
'''
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    # Run RAG logic
    response = process_pdf(file_path)
    return jsonify({"message": "File processed", "data": response}), 200
    '''

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    response = process_document(file_path)
    return jsonify({"message": "File processed", "data": response}), 200

@app.route("/voice", methods=["POST"])
def voice():
    if "audio" not in request.files:
        return jsonify({"error": "No audio uploaded"}), 400
    audio_file = request.files["audio"]

    # Run voice transcription logic
    text = transcribe_audio(audio_file)
    return jsonify({"transcription": text}), 200
'''@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        response_text = get_answer_from_openrouter(prompt)
        return jsonify({"response": response_text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500'''
'''
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        # Pass prompt to RAG logic
        response = process_document(prompt)  # Or rename processor logic to accept prompts
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        '''

from rag_logic.processor import answer_with_rag

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        print(f"Prompt received: {prompt}")
        response = answer_with_rag(prompt)  # ✅ Correct function!
        return jsonify({"response": response}), 200
    except Exception as e:
        print(f"ERROR during chat processing: {e}")
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
