import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Api from './Api';
import LocalApi from './LocalApi';
import Session from './Session';
import { actualLevel, rulesForLevel } from './levels'

// See if we're running locally or remote based on the environment variable
// Locally is the default mode unless we're told otherwise
const runLocally = process.env.REACT_APP_API_TYPE !== 'remote';

// Parse the URL to extract game ID
const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
const levelOrGameId = pathSegments[0]
const gameId = parseInt(levelOrGameId);

// Look for the auto start flag
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const autoStart = urlParams.get('start') === 'auto';

// Lookup that difficult in our rules
const level = actualLevel(levelOrGameId);
const rules = rulesForLevel(level);

// Create a new session
const session = new Session(gameId, 'human', level, rules);
const api = runLocally ? new LocalApi(session) : new Api(session);

// When a new game is created, we'll be notified so we can change our URL
// This way, if they then refresh the page – they don't have to start over
// Also they can share the link from their browser to invite another player to watch the game
api.onNewGame = (newGameId) => {
    const newPath = `/${newGameId}`;
    window.history.replaceState(null, 'Retro Rabbit', newPath);
}

// Render our react components now
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App api={api} autoStart={autoStart}/>
  </React.StrictMode>
);
