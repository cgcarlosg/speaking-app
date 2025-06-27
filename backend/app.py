from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import psutil

app = Flask(__name__)
CORS(app)

def select_whisper_model():
    total_gb = psutil.virtual_memory().total / (1024 ** 3)
    if total_gb >= 12:
        return "large"
    elif total_gb >= 8:
        return "medium"
    elif total_gb >= 4:
        return "small"
    else:
        return "base"

model_name = select_whisper_model()
model = whisper.load_model(model_name)
print(f"Modelo Whisper seleccionado automáticamente: {model_name}")

# Calienta el modelo con un audio vacío para evitar retrasos en la primera petición real
import numpy as np
import soundfile as sf

def warmup_model():
    # Crea un archivo wav vacío temporal
    empty_audio = np.zeros(16000, dtype=np.float32)  # 1 segundo de silencio a 16kHz
    sf.write("warmup.wav", empty_audio, 16000)
    try:
        model.transcribe("warmup.wav", language="es")
        print("Modelo Whisper calentado y listo para usar.")
    except Exception as e:
        print(f"Error al calentar el modelo: {e}")
    finally:
        if os.path.exists("warmup.wav"):
            os.remove("warmup.wav")

warmup_model()

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    audio = request.files['audio']
    audio_path = 'temp.wav'
    audio.save(audio_path)

    try:
        result = model.transcribe(audio_path, language="es")
        return jsonify({'text': result['text']})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == '__main__':
    app.run(debug=True, port=8000)