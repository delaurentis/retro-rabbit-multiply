import React from 'react';
import Bunny from './Bunny';
import './Cell.css';

function Cell(props) {

  // We use absolute positioning for our cells
  // with percentage based sizing so they scale
  // We do need to know the board size 
  const customStyle = {  width: `${100 / props.board.width}%`,
                         height: `${100 / props.board.height}%`,
                         left: `${(100 * (props.x - 1)) / props.board.width}%`,
                         top: `${(100 * (props.y - 1)) / props.board.height}%` }
  
  // Send click upward for top level logic to handle 
  // We're just a minion down here with very little context
  const handleClick = () => {
    if ( props.onClickCell ) {
      props.onClickCell(props.x, props.y);
    }
  }
  
  // Optional label
  const label = () => {
    if ( props.x === 1 ) {
      return <span className='CellLabel'>{props.y}</span>;
    }
    else if ( props.y === 1 ) {
      return <span className='CellLabel'>{props.x}</span>;
    }
    else if ( props.answer ) {
      return <span className='CellLabel'>{props.answer}</span>;
    }
    return <span/>;
  }
  
  // Optional rabbit
  const bunny = () => {
    if ( props.selected && !props.answer ) {
      return <Bunny action='still'/>;
    }
  };
  
  // Change how we show cell based on if the answer is right or wrong
  const answerType = () => {
    if ( props.answer ) {
      if ( props.answer === props.x * props.y ) {
        return 'correct';
      }
      else {
        return 'wrong';
      }
    }
  }
  
  return (
    <div className='Cell' style={customStyle} onClick={handleClick} answer={answerType()}>
      {label()}
      {bunny()}
    </div>
  );
}

export default Cell;
