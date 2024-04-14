import React from 'react';
import Carrot from '../Carrot';
import './CarrotMeter.css';

function CarrotMeter(props) {
  
  // Create an array for our carrots that we can iterate through below
  const numbersInRange = (min, max) => Array.from({length: max}, (value, index) => index + min);
  const columns = numbersInRange(1, props.carrots);
  
  const isFlashing = (props.canFlash && props.carrots < 3);
  
  // Render our meter now
  return (
    <span className='CarrotMeter' flashing={isFlashing ? 'yes' : 'no'}>
      {columns.map((column, index) => <Carrot/>)}
    </span>
  );
}

export default CarrotMeter;
