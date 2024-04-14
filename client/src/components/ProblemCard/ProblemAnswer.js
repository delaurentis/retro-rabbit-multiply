import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProblemAnswer.css';

function ProblemAnswer(props) {
  
  // Store the answer locally until they hit enter
  const [answer, setAnswer] = useState();
  
  // Get the answer color
  let answerColor = 'white';
  if ( props.isCorrect === true ) {
    answerColor = '#00ff00';
  }
  else if ( props.isCorrect === false ) {
    answerColor = 'red';
  }

  // Focus on the input
  const focus = () => {
    if ( inputRef && inputRef.current ) {
      inputRef.current.focus();
    }
  }
  
  // Auto-focus the user
  // Don't let them leave the field
  const inputRef = useRef();
  useEffect(focus, [inputRef]);
  useEffect(() => {

    // Auto-focus now
    focus();
    
    // And keep auto-focusing so they can type anytime
    const timer = setInterval(focus, 500);
    return () => clearInterval(timer);
    
  }, [inputRef]);
  
  // Catch enter key presses
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if ( props.onAnswer ) {
        props.onAnswer(event.target.value);
      }
    }
  };
  
  // Input if there's a keyboard
  const input = () => {
    
    // If we don't pass in a value from the keypad
    if ( props.answerFromPad && props.answerFromPad.length > 0 ) {
      return <div className='ProblemAnswerFromPad'>{props.answerFromPad}</div>
    }
    else {
      return (
        <input className='ProblemAnswerInput' 
           style={{ color: answerColor }}
           type='text' 
           ref={inputRef} 
           placeholder='?'
           readonly={props.isReadOnly ? 'readonly' : undefined}
           onKeyDown={handleKeyDown}
           onChange={(event) => setAnswer(event.target.value)} 
           value={answer}/>
      );
    }
  };

  
  return (
    <div className='ProblemAnswer'>
      {input()}
    </div>
  );
}

export default ProblemAnswer;
