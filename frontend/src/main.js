const recordBtn = document.getElementById('recordBtn');
const transcriptEl = document.getElementById('transcript');
const langSwitch = document.getElementById('langSwitch'); 
const devTopicBtn = document.getElementById('devTopicBtn');
const respuestaEl = document.getElementById('respuesta');
const clearTranscriptBtn = document.getElementById('clearTranscriptBtn');

const generalTopicBtn = document.getElementById('generalTopicBtn');
const respuestaLabel = document.getElementById('respuestaLabel');

devTopicBtn.addEventListener('click', () => {
  respuestaLabel.textContent = 'Tema de desarrollo';
  selectedTopic = 'development';
});

generalTopicBtn.addEventListener('click', () => {
  respuestaLabel.textContent = 'Tema general';
  selectedTopic = 'general';
});

let selectedTopic = 'general';
let mediaRecorder;
let audioChunks = [];

clearTranscriptBtn.addEventListener('click', () => {
  transcriptEl.textContent = '';
});

recordBtn.addEventListener('click', async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // Detecta el idioma seleccionado
      const selectedLang = langSwitch.checked ? 'en' : 'es';
      formData.append('language', selectedLang);
      formData.append('topic', selectedTopic);
      transcriptEl.textContent = '⏳ Transcribiendo...';

      try {
        const response = await fetch('http://localhost:8000/transcribe', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        transcriptEl.textContent = data.text || '[Sin transcripción]';
        respuestaEl.value = data.respuesta || '';
      } catch (err) {
        transcriptEl.textContent = '❌ Error al enviar el audio.';
        console.error(err);
      }
    };

    mediaRecorder.start();
    recordBtn.textContent = 'Detener';
  } else {
    mediaRecorder.stop();
    recordBtn.textContent = 'Grabar';
  }
});