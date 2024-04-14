import React from 'react';
import './Button.css';

function Button(props) {
  
  // Send click upward for top level logic to handle 
  // We're just a minion down here with very little context
  const handleClick = () => {
    if ( props.onClickButton ) {
      props.onClickButton();
    }
  }
  
  return (
    <div className='Button' onClick={handleClick}>{props.title}</div>
  );
}

export default Button;
