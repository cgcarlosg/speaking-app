from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import psutil
import soundfile as sf
import numpy as np
import requests
import time

# Si estás usando torch, descomenta:
# import torch

app = Flask(__name__)
CORS(app)

# --- Selección automática del modelo según RAM ---
def select_whisper_model():
    total_gb = psutil.virtual_memory().total / (1024 ** 3)
    if total_gb >= 12:
        return "large"
    elif total_gb >= 8:
        return "medium"
    elif total_gb >= 4:
        return "small"
    elif total_gb >= 1.5:
        return "base"
    else:
        return "tiny"

model_name = select_whisper_model()
model = whisper.load_model(model_name)
print(f"✅ Modelo Whisper cargado: {model_name}")

# Si querés usar GPU con PyTorch y estás seguro de tenerlo:
# device = "cuda" if torch.cuda.is_available() else "cpu"
# model = model.to(device)

# --- Calienta el modelo una vez ---
def warmup_model():
    empty_audio = np.zeros(16000, dtype=np.float32)  # 1 segundo de silencio
    sf.write("warmup.wav", empty_audio, 16000)
    try:
        model.transcribe("warmup.wav", language="es")
        print("🔥 Modelo Whisper calentado y listo.")
    except Exception as e:
        print(f"⚠️ Error en warmup: {e}")
    finally:
        if os.path.exists("warmup.wav"):
            os.remove("warmup.wav")

warmup_model()

# --- Endpoint principal ---
@app.route('/transcribe', methods=['POST'])
def transcribe():
    start_time = time.time()

    if 'audio' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    audio = request.files['audio']
    audio_path = 'temp.wav'
    audio.save(audio_path)

    language = request.form.get('language', 'es')
    topic = request.form.get('topic', 'general')

    try:
        # Transcribe con Whisper
        whisper_start = time.time()
        result = model.transcribe(audio_path, language=language, task="transcribe")
        transcript = result['text']
        whisper_time = time.time() - whisper_start
        print(f"🗣️ Transcripción Whisper: {whisper_time:.2f}s")

        # Construye el prompt para Ollama
        if language == 'en':
            prompt = f"Answer as an expert in {topic}. The question is: {transcript}"
        else:
            prompt = f"Responde como experto en {topic}. La pregunta es: {transcript}"

        # Solicita respuesta a Ollama (TinyLLaMA)
        respuesta = ""
        response_start = time.time()
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "tinyllama",
                "prompt": prompt,
                "stream": False  # más rápido si no necesitás leer línea por línea
            }
        )

        if ollama_response.status_code == 200:
            data = ollama_response.json()
            respuesta = data.get("response", "")
        else:
            respuesta = "No se pudo obtener respuesta de Ollama."

        response_time = time.time() - response_start
        print(f"💬 Respuesta de Ollama: {response_time:.2f}s")

        total_time = time.time() - start_time
        print(f"⏱️ Tiempo total /transcribe: {total_time:.2f}s")

        return jsonify({'text': transcript, 'respuesta': respuesta})

    except Exception as e:
        print(f"❌ Error en /transcribe: {e}")
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
