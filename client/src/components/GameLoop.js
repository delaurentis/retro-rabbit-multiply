import React, { useState, useEffect } from 'react';
import Bunny from './Bunny';
import Board from './Board';
import NumberPad from './NumberPad';
import ProblemCard from './ProblemCard';
import StartCard from './StartCard';
import CryingCard from './CryingCard';
import CelebratingCard from './CelebratingCard';
import LevelMenu from './LevelMenu';
import './GameLoop.css';

const animationDuration = 2200;

function GameLoop(props) {

  // Don't accept the new problem from the server right away
  const [currentProblem, setCurrentProblem] = useState(props.nextProblem);
  const [advanceAt, setAdvanceAt] = useState(new Date());
  const [waiting, setWaiting] = useState(false);
  const [started, setStarted] = useState(props.autoStart);
  
  // Jackpot will shrink over time
  const [jackpot, setJackpot] = useState(props.nextProblem ? props.nextProblem.jackpot : 0);
  
  // They can use the number pad to type in a number
  const [answerFromPad, setAnswerFromPad] = useState('');

  // Advance to the next problem
  const advanceAfterAnimation = () => {

    // Get ready to advance to the next problem
    // Leaving time for any animations
    setWaiting(true);
    setAdvanceAt(new Date(Date.now() + animationDuration));
    setTimeout(() => { setWaiting(false); }, animationDuration + 1);
  }
  
  // Handle the first problem we get from the server
  useEffect(() => {
    
    // If there isn't a current problem yet, then set one
    if ( !currentProblem && props.nextProblem ) {
         setCurrentProblem(props.nextProblem);
         setJackpot(props.nextProblem.jackpot);
    }
  }, [props.nextProblem]);

  // Run our loop to update
  useEffect(() => {
    const gameLoop = () => {
      
      // Lose a carrot at some rate
      if ( currentProblem && !currentProblem.answer && jackpot > 0 ) {
        setJackpot(jackpot - 1, 0);
      }
    };

    // Remove carrots, etc.
    const timer = setInterval(() => gameLoop(), 1500);
    return () => clearInterval(timer);
    
  }, [jackpot]);
  
  // Start the first question
  const handleStart = () => {
    
    // Reset the jackpot if it started counting down
    setJackpot(currentProblem.jackpot);
    
    // Hide the start screen
    setStarted(true);
  };
  
  // Record our answer to the server
  // but show the answer and an animation 
  // to both cover the delivery time to the server
  // and also give the player a chance to take it in
  const handleAnswer = (problem) => { 

    // Update to reflect our answer
    setCurrentProblem(problem);

    // Advance to the next question after some time
    advanceAfterAnimation();
    
    // Pass it up so it (we don't send to server here)
    if ( props.onAnswer ) {
      props.onAnswer(problem);
    }
  };
  
  // Advance to the next problem
  if ( props.nextProblem &&
       currentProblem && 
       currentProblem.id !== props.nextProblem.id  ) {
    
    // If we're watching, we need to trigger the advance here
    if ( props.isWatching && !advanceAt ) {
      advanceAfterAnimation();
    }
    else {
    
      // If the current problem and new problem are different
      // and the current problem was answered over N seconds ago, we can accept the new one
      const isReadyToAdvance = advanceAt && Date.now() >= advanceAt.getTime();
      if ( isReadyToAdvance ) {
        setAnswerFromPad(undefined);
        setCurrentProblem(props.nextProblem);
        setJackpot(props.nextProblem ? props.nextProblem.jackpot : 0);
        setAdvanceAt(undefined);
      }
    }
  }
  
  // Append any number pad presses
  const clickedNumberPad = (value) => {
    if ( value === 'Clear' ) {
      setAnswerFromPad('');
    }
    else if ( value === 'Delete' ) {
      if ( answerFromPad ) { 
        setAnswerFromPad(answerFromPad.slice(0, answerFromPad.length - 1));
      }
    }
    else if ( value === 'Enter' ) {
      const answer = parseInt(answerFromPad)
      handleAnswer({ ...currentProblem, 
                    answer: answer, 
                    correct: (currentProblem.a * currentProblem.b) === answer,
                    score: jackpot});
    }
    else {
      if ( answerFromPad ) {
        setAnswerFromPad(`${answerFromPad}${value}`);
      }
      else {
        setAnswerFromPad(`${value}`);
      }
    }
  }
  
  // Pick the right card to show
  const card = () => {
    if ( props.action === 'crying' ) {
      return <CryingCard score={props.score} level={props.level}/>;
    }
    else if ( props.action === 'celebrating' ) {
      return <CelebratingCard score={props.score} level={props.level}/>;
    }
    else if ( props.action == 'playing' && props.problems.length <= 1 && !started ) {
      
      // If we're playing, and there's just 1 question... and we haven't 
      // officially started then let's show the start screen
      return <StartCard score={props.score} onStart={handleStart}/>;
    }
    else {    
      return <ProblemCard hearts={props.hearts}
                          score={props.score} 
                          problem={currentProblem} 
                          jackpot={jackpot} 
                          onAnswer={handleAnswer}
                          answerFromPad={answerFromPad}
                          isWatching={props.isWatching}/>;
    }
  };
  

  // Show our prompts up top, and two boards underneathe
  return (
    <div className='GameLoop'>
      <div>
        <LevelMenu level={props.level}/>
        {card()}
        <Board min={props.min} 
               max={props.max} 
               problem={currentProblem} 
               problems={props.problems}/>
      </div>
      <NumberPad onClickButton={clickedNumberPad}/>
    </div>
  );
}

export default GameLoop;
