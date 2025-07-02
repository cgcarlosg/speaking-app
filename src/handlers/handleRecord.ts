import { MutableRefObject } from 'react';

interface HandleRecordParams {
  isEnglish: boolean;
  selectedTopic: 'general' | 'development';
  setTranscript: (text: string) => void;
  setRespuesta: (text: string) => void;
  setRecording: (value: boolean) => void;
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
  audioChunksRef: MutableRefObject<Blob[]>;
}

export async function handleRecord({
  isEnglish,
  selectedTopic,
  setTranscript,
  setRespuesta,
  setRecording,
  mediaRecorderRef,
  audioChunksRef,
}: HandleRecordParams) {
  if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const selectedLang = isEnglish ? 'en' : 'es';
      formData.append('language', selectedLang);
      formData.append('topic', selectedTopic);
      setTranscript('⏳ Transcribiendo...');

      try {
        const response = await fetch('http://localhost:8000/transcribe', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        setTranscript(data.text || '[Sin transcripción]');
        setRespuesta(data.respuesta || '');
      } catch (err) {
        setTranscript('❌ Error al enviar el audio.');
        console.error(err);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  } else {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }
}
