import React from 'react';
import Cell from './Cell'
import './Board.css';

function Board(props) {

  // Get all our row and column numbers
  const numbersInRange = (min, max) => Array.from({length: max}, (value, index) => index + min);
  const rows = numbersInRange(props.min - 1, props.max);
  const columns = numbersInRange(props.min - 1, props.max);

  // Handle a click on any cell in the board
  const handleClick = (x, y) => {  
    if ( props.onClickBoard ) {
      props.onClickBoard(x, y);
    }
  };
  
  const boardSize = (props.max - props.min) + 2;
  const board = { width: boardSize, height: boardSize };
  const problem = props.problem || {};
  const problems = props.problems || [];

  // Create the board now that shows them
  return (
    <div className='Board'>
      <div className='Grid'>
        {
          // Cells exist to detect clicks and show visual boundaries
          rows.map(y => {
            return columns.map(x => {
              
              // Do we have an answer for this one?
              const answeredProblem = problems.find(problem => problem.a === x && problem.b === y);
              const answer = answeredProblem && answeredProblem.answer;
              
              // Is this selected
              const selected = x === problem.a && y == problem.b;
              
              return <Cell key={`${x}x${y}`}
                           x={x} 
                           y={y} 
                           board={board} 
                           answer={answer}
                           selected={selected}
                           onClickCell={handleClick}/>;
            });
          })
        }
      </div>
    </div>
  );
}

export default Board;

// #13c0ff