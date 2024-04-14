import React from 'react';
import Level from './Level';
import './LevelMenu.css';
import { levels } from '../levels'

function LevelMenu(props) {
  
  // Render our meter now
  return (
    <div className='LevelMenu'>
      {levels.map(level => <Level level={level} isActive={level == props.level}/>)}
    </div>
  );
}

export default LevelMenu;
