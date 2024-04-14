import React from "react";
import Button from "./Button";
import "./Prompt.css";

function Prompt(props) {
  
  const handleClick = () => {
    if ( props.onClickButton ) {
      props.onClickButton();
    }    
  };
  
  return (
    <div className='Prompt'>
      <div className='PromptTitle'>{props.title}</div>
      <p className='PromptParagraph'>{props.children}</p>
      <div className='PromptButton'><Button title={props.buttonTitle} onClickButton={handleClick}/></div>
    </div>
  );
}

export default Prompt;
