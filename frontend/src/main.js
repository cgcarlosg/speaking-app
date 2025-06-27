const recordBtn = document.getElementById('recordBtn');
const transcriptEl = document.getElementById('transcript');

let mediaRecorder;
let audioChunks = [];

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

      transcriptEl.textContent = '⏳ Transcribiendo...';

      try {
        const response = await fetch('http://localhost:8000/transcribe', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        transcriptEl.textContent = data.text || '[Sin transcripción]';
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
