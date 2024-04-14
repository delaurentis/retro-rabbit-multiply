import React from 'react';
import './Level.css';
import { generateUrl } from "../util/url";

function Level(props) {
  
  const handleClick = () => {
    if ( !props.isActive ) {
    
      // Create a new game at the given level
      window.location.href = generateUrl({ level: props.level });
    }
  }
  
  const title = props.level.charAt(0).toUpperCase() + props.level.slice(1)
  return (
    <span className='Level' onClick={handleClick} active={props.isActive ? 'yes' : undefined}>{title}</span>
  );
}

export default Level;
