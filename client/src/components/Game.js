import React, { useState, useEffect } from 'react';
import GameLoop from './GameLoop';
import './Game.css';

function Game(props) {

  // Shortcut for below
  const api = props.api;
    
  // Game state from server
  const [snapshot, setSnapshot] = useState({ player: {} });
  const [action, setAction] = useState();
  
  // Update our snapshot and action
  const updateFromSnapshot = (newSnapshot = {}) => {
    setAction(newSnapshot.player && newSnapshot.player.action);
    setSnapshot(newSnapshot);
  }
  
 // Initial setup
  useEffect(() => {

    // Debounce multiple calls (happens in development in react strict mode)
    if ( api.session.isSetupNeeded() ) {

      // So we can use await from a hook or interval, we need async wrapper methods
      const setup = async () => { updateFromSnapshot(await api.setupGame()); };
      setup();
    }
    
  }, [api]);

  // If we're watching another player...
  useEffect(() => {
    if ( action === 'watching' ) {
      
      // Refresh every second
      const refresh = async () => { updateFromSnapshot(await api.getSnapshot()); };
      const timer = setInterval(() => refresh(), 1000);
      return () => clearInterval(timer);
    }
  }, [action]);
  
  // Get unanswered problems
  const problems = (snapshot && snapshot.problems) || [];
  const unansweredProblems = problems.filter(problem => !problem.answer);
  const nextProblem = unansweredProblems[0];
  
  // Find all the mistakes we've made
  const mistakes = problems.filter(problem => !!problem.answer && !problem.correct);
  
  // Record our answer to the server
  // but show the answer and an animation 
  // to both cover the delivery time to the server
  // and also give the player a chance to take it in
  const answer = async (problem) => { updateFromSnapshot(await api.answerProblem(problem)); };
  
  // Get the basic info
  const { min, max, score, hearts, level } = (snapshot.game || {});
  
  // Only process if we have a snapshot ready
  if ( snapshot && snapshot.game ) {
      
    // Show our prompts up top, and two boards underneathe
    return (
      <GameLoop nextProblem={nextProblem} 
                problems={problems} 
                action={action}
                min={min} 
                max={max} 
                score={score}
                level={level}
                autoStart={props.autoStart}
                hearts={hearts - mistakes.length}
                isWatching={action === 'watching'}
                onAnswer={problem => answer(problem)}/>
    );
  }
  return <div/>;
}

export default Game;
