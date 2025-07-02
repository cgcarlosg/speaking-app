import React from 'react'
import './ResponseArea.scss'

interface ResponseAreaProps {
    label: string;
    value: string;
}

const ResponseArea : React.FC<ResponseAreaProps> = ({ label, value }) => { 
  return (
    <div className="respuesta">
      <p><strong>Respuesta:</strong><span id="respuestaLabel">{label}</span></p>
      <textarea
        id="respuesta"
        readOnly
        value={value}
      ></textarea>
    </div>
  )
}

export default ResponseArea
