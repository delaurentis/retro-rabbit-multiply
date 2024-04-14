import React from 'react';
import Heart from './Heart';
import './HeartMeter.css';

function HeartMeter(props) {
  
  // Create an array for our carrots that we can iterate through below
  const numbersInRange = (min, max) => Array.from({length: max}, (value, index) => index + min);
  const columns = numbersInRange(1, props.hearts);
  
  // Make it flash
  const isFlashing = (props.hearts < 2);
  
  // Render our meter now
  return (
    <span className='HeartMeter' flashing={isFlashing ? 'yes' : 'no'}>
      {columns.map((column, index) => <Heart/>)}
    </span>
  );
}

export default HeartMeter;
