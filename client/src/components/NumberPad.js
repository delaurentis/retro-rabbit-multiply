import React from 'react';
import NumberButton from './NumberButton';
import './NumberPad.css';

function NumberPad(props) {
  
  // Pass the clicks on up
  const handleClick = (value) => {
    if ( props.onClickButton ) {
      props.onClickButton(value);
    }
  }

  // Create an array for our carrots that we can iterate through below
  const numbersInRange = (min, max) => Array.from({length: max}, (value, index) => index + min);
  const numbers = numbersInRange(1, 9);
  
  // Make it flash
  const isFlashing = (props.hearts < 2);
  
  // Render our meter now
  return (
    <span className='NumberPad'>
      {numbers.map(currentNumber => <NumberButton label={currentNumber} onClickButton={handleClick}/>)}
      <NumberButton label='0' onClickButton={handleClick} mobile='hide'/>
      <NumberButton label='Delete' onClickButton={handleClick}/>
      <NumberButton label='0' onClickButton={handleClick} mobile='show'/>
      <NumberButton label='Enter' onClickButton={handleClick}/>
    </span>
  );
}

export default NumberPad;
