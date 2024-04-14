import React, { useState, useEffect } from "react";
import Card from '../Card';
import Score from "../Score";
import Button from "../Button";
import Prompt from "../Prompt";
import "./index.css";
import { generateUrl } from "../../util/url";

function CryingCard(props) {
  
  const newGame = () => {
    window.location.href = generateUrl({ level: props.level, autoStart: true });
  }

  // Render our problem here
  return (
    <Card bunny='crying'> 
      <div className='CryingPrompt'>
         <Prompt title='Game Over' buttonTitle='Play Again' onClickButton={newGame}>
           Retro is hungry and still needs your help.
         </Prompt>
      </div>
      <Score score={props.score} />
    </Card>
  );
}

export default CryingCard;
