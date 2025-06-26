from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os

app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde tu frontend

model = whisper.load_model("base")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    audio = request.files['audio']
    audio_path = 'temp.wav'
    audio.save(audio_path)

    result = model.transcribe(audio_path, language="es")
    os.remove(audio_path)

    return jsonify({'text': result['text']})

if __name__ == '__main__':
    app.run(debug=True, port=8000)  # Usa el puerto 8000
