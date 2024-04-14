import React, { useState, useEffect } from "react";
import Card from '../Card';
import Confetti from "../Confetti";
import Score from "../Score";
import Button from "../Button";
import Prompt from "../Prompt";
import "./index.css";
import { generateUrl } from "../../util/url";

function CelebratingCard(props) {
  
  const newGame = () => {
    window.location.href = generateUrl({ level: props.level });
  }

  // Render our problem here
  return (
    <Card bunny='earlift'> 
      <div className="CelebratingConfetti">
       <Confetti/>
      </div>
      <div className='CelebratingPrompt'>
        <Prompt title='You Won!' buttonTitle='Play Again' onClickButton={newGame}>
        Retro is grateful for the carrots!
        </Prompt>
      </div>
      <Score score={props.score} />
    </Card>
  );
}

export default CelebratingCard;
