import React from 'react';
import Bunny from './Bunny';
import './Card.css';

function Card(props) {
  return (
    <span className='Card'>
      <div className='BigBunny'><Bunny action={props.bunny} pad='top'/></div>
      <div className='CardContent'>
        <div>{props.children}</div>
      </div>
    </span>
  );
}

export default Card;
