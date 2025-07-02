import React from 'react'
import Button from '../Button/Button'
import './TranscriptionArea.scss'

interface TranscriptionAreaProps {
    text: string;
    content: string;
    onClear: () => void;
}

const TranscriptionArea : React.FC<TranscriptionAreaProps> =  ({ 
    text,
    content,
    onClear

}) => {
  return (
       <div className={'transcript'}>
          <p><strong>{text}</strong></p>
          <div id="transcript">{content}</div>
          <Button label='Borrar' onClick={() => onClear()} />
        </div>
  )
}

export default TranscriptionArea
