const {createGame,
       getGame,
       answerProblem} = require('./endpoints');

const setupApi = (app, db) => {
  
  // Create a new game
  app.post('/api/game', (request, response) => { createGame(db, request, response); });
    
  // Return the state of the game (score, etc)
  app.get('/api/game/:gameId', (request, response) => { getGame(db, request, response); });

  // Give an answer to a problem
  app.put('/api/game/:gameId/problem/:problemId', (request, response) => { answerProblem(db, request, response); });

};

module.exports = { setupApi };



