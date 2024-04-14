import React, { useState } from 'react';
import './NumberButton.css';

function NumberButton(props) {
  
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if ( props.onClickButton ) {
      props.onClickButton(props.label);
    }
  }
  
  return (
    <div className='NumberButton' 
         mobile={props.mobile}      
         pressed={pressed ? 'yes' : 'no'}
         onClick={handleClick} 
         onTouchStart={() => setPressed(true)} 
         onTouchEnd={() => setPressed(false)}>
      <div className='NumberButtonLabel'>
        <span>{props.label}</span>
      </div>
    </div>
  );
}

export default NumberButton;
