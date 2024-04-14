import React, { useState, useEffect } from 'react';
import Carrot from './Carrot';
import './Score.css';

function Score(props) {

  // Start with the property
  const [score, setScore] = useState(props.score || 0);
  
  // Animate to the new score
  useEffect(() => {

    // Increment the score steadily upward
    const incrementScore = () => {
      setScore(Math.min(props.score, score + 1))
    };
    
    // Keep counting up
    const timer = setInterval(incrementScore, 200);
    
    // When we delete this component, delete the timer
    return () => clearInterval(timer);
            
  }, [score, props.score]);
  
  
  return (
    <div className='Score'>
      <span className='ScoreReadout'>{score}</span>
      <span className='ScoreSymbol'><Carrot/></span>
    </div>
  );
}

export default Score;
