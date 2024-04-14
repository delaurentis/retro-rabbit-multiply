import React, { useState, useEffect } from 'react';
import ProblemAnswer from './ProblemAnswer';
import './Problem.css';

function Problem(props) {

  const problem = props.problem || {};
  
  return (
    <div className='ProblemContainer'>
      <div className='Problem'>
        <span>{problem.a}</span>
        <span>{problem.operator || 'x'}</span>
        <span>{problem.b}</span>
        <span>=</span>
        <ProblemAnswer isCorrect={problem.answer && !!problem.correct} 
                       isReadOnly={props.isReadOnly} 
                       answerFromPad={props.answerFromPad}
                       onAnswer={props.onAnswer}/>
      </div>
    </div>
  );
}

export default Problem;
