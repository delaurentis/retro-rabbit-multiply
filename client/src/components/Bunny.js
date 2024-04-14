import React from 'react';
import './Bunny.css';

function Bunny(props) {
  const customStyle = {};
  
  // Is the bunny still?
  // Is it happy, is it crying?
  
  return (
    <span className='Bunny'>
      <div className='BunnyImage' action={props.action || 'still'} pad={props.pad || 'no'}/>
    </span>
  );
}

export default Bunny;
