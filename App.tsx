import React, { useState, useRef } from "react";
import Button from "./src/components/Button/Button";
import TranscriptionArea from "./src/components/TranscriptionArea/TranscriptionArea";
import "./src/style.scss";
import ResponseArea from "./src/components/ResponseArea/ResponseArea";
import { handleLangSwitch } from "./src/handlers/handleLangSwitch";
import { handleTopicSelect } from "./src/handlers/handleTopicSelect";
import { handleClearTranscript } from "./src/handlers/handleClearTranscript";
import { handleRecord } from "./src/handlers/handleRecord";

const App: React.FC = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<"general" | "development">(
    "general"
  );
  const [transcript, setTranscript] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [respuestaLabel, setRespuestaLabel] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  return (
    <div className="container">
      <h1>🎙️ Speaking Practice</h1>

      <div className="settings">
        <Button
          label={recording ? "Detener" : "Grabar"}
          onClick={() =>
            handleRecord({
              isEnglish,
              selectedTopic,
              setTranscript,
              setRespuesta,
              setRecording,
              mediaRecorderRef,
              audioChunksRef,
            })
          }
        />

        <div className="button-group">
          <Button
            label="Tema de desarrollo"
            onClick={() =>
              handleTopicSelect(
                "development",
                setSelectedTopic,
                setRespuestaLabel
              )
            }
          />
          <Button
            label="Tema general"
            onClick={() =>
              handleTopicSelect("general", setSelectedTopic, setRespuestaLabel)
            }
          />
          <label>
            <input
              type="checkbox"
              checked={isEnglish}
              onChange={() => handleLangSwitch(setIsEnglish)}
            />
            Inglés (Default: Español)
          </label>
        </div>
      </div>

      <div className="content-wrapper">
        <TranscriptionArea
          text="Texto detectado:"
          content={transcript}
          onClear={() => handleClearTranscript(setTranscript)}
        />

        <ResponseArea label={respuestaLabel} value={respuesta} />
      </div>
    </div>
  );
};

export default App;
