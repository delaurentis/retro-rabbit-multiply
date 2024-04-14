import React from 'react';
import Game from './components/Game';
import './App.css';

function App(props) {  
  return (
    <div className='App'>
      <Game api={props.api} autoStart={props.autoStart}/>
    </div>
  );
}

export default App;
