import React, { useState, useEffect } from "react";
import Card from '../Card';
import Score from "../Score";
import Button from "../Button";
import Prompt from "../Prompt";
import "./index.css";

function StartCard(props) {
  
  const startGame = () => {
    if ( props.onStart ) {
      props.onStart();
    }
  }

  // Render our problem here
  return (
    <Card bunny='still'> 
      <div className='StartPrompt'>
        <Prompt title='Retro Rabbit' buttonTitle='Start Now' onClickButton={startGame}>
          <div>is learning multiplication. Can you help?</div>
          <div>Retro gets more carrots for fast answers.</div>
        </Prompt>
      </div>
      <Score score={props.score} />
    </Card>
  );
}

export default StartCard;
