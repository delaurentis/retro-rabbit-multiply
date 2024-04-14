import React, { useState, useEffect } from 'react';
import CarrotMeter from './CarrotMeter';
import './Jackpot.css';

function Jackpot(props) {
  return (
    <div className='Jackpot'>
      <span className='JackpotLabel'>{props.label}</span>
      <CarrotMeter canFlash={props.canFlash} carrots={props.carrots}/>
    </div>
  );
  
}

export default Jackpot;
