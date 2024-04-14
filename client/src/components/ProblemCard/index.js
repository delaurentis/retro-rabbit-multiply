import React, { useState, useEffect, useRef } from 'react';
import Card from '../Card';
import Score from '../Score';
import HeartMeter from '../HeartMeter';
import Jackpot from './Jackpot';
import Problem from './Problem';
import './index.css';

function ProblemCard(props) {
  
  // Shortcut
  const problem = props.problem || {};
  
  // Did they get the right answer?
  const handleAnswer = (value) => {

    // Pass it on up, we're just a minion
    if ( props.onAnswer ) {

      // Merge the answer and jackpot into our problem
      const answer = parseInt(value);
      props.onAnswer({ ...problem, 
                       answer: answer,
                       score: props.jackpot,
                       correct: (problem.a * problem.b) === answer});
    }
  }
  
  // Figure out if bunny should do anything
  const bunnyAction = () => {
    if ( !problem || !problem.answer ) {
      return 'still';
    }
    else if ( problem.correct ) {
      return 'earlift';
    }
    else if ( !problem.correct ) {
      return 'tear';
    }
    return 'still';
  };

  // Figure out how to display our jackpot 
  const jackpotDisplay = () => {
    if ( problem ) {
      if ( props.isWatching ) { 
        return <Jackpot label='They earn up to:' carrots={problem.jackpot}/>
      }
      else if ( problem.answer ) {
        if ( problem.correct ) {
          if ( problem.score >= 1 ) {
            return <Jackpot label='Right! You got:' carrots={problem.score}/>
          }
          else {
            return <Jackpot label='Yep! Go fast for carrots' carrots={0}/>
          }
        }
        else {
          return <Jackpot label={'Oops! Sorry no carrots.'} carrots={0}/>
        }
      }
      else if ( props.jackpot > 0 ) {
        return <Jackpot canFlash={true} label='Solve to earn' carrots={props.jackpot}/>
      }      
      else {
        return <Jackpot label='Solve to continue' carrots={0}/>
      }
    }
  };

  // Prompt the user to solve the given problem
  const problemPrompt = () => {
    if ( problem ) {
      return <Problem key={`${problem.a}x${problem.b}`}
                      problem={problem}
                      onAnswer={handleAnswer}
                      answerFromPad={props.answerFromPad}
                      isReadOnly={props.isWatching}/>;
    }    
  };
  
  // Render our problem here
  return (
    <Card bunny={bunnyAction()}> 
      <Score score={props.score}/>
      <HeartMeter hearts={props.hearts}/>
      {problemPrompt()}
      {jackpotDisplay()}
    </Card>
  );
}

export default ProblemCard;
