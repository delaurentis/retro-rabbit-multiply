const Game = require('../db/models/game');
const {respondWithData, respondWithError} = require('./utils');

// We use this a bunch of places
const PLAYER_SECRET_HEADER = 'Player-Secret';

// Used by player to create a new game
const createGame = async (db, request, response) => {
  
  try {
  
    // We write to and then read from the DB, so wrap in a transaction for safety
    const data = await db.transaction(async safeDb => {
      
      // Create the game
      const { min, max, hearts, level } = request.body;
      const game = await Game.create(safeDb, min, max, hearts, level);
      
      // Generate the next problem now
      await game.generateNextProblem();
    
      // Return our game with the 1st problem
      return await(game.getEverythingPlayerCanSee()) || {};
    });
      
    respondWithData(response, data);
  }
  catch(error) {
    respondWithError(response, error, { log: true });
  }
}

// Lookup the game from the given player's point of view
const getGame = async (db, request, response) => {
  
  // This might fail if they have the wrong player secret
  try {
    
    // Lookup the game from the point of view of the player
    // Since this is a read operation only, it's ok to be outside of a transaction
    const game = new Game(db, 
                          parseInt(request.params.gameId), 
                          { secret: request.header(PLAYER_SECRET_HEADER) });
  
    // Get the game state and return it
    const data = await(game.getEverythingPlayerCanSee()) || {};
    respondWithData(response, data);
  }
  catch(error) {
    respondWithError(response, error, { log: true });
  }
};

// Post an answer to a problem: might be right or wrong
const answerProblem = async (db, request, response) => {
  
  // This might fail if they have the wrong player secret
  try {
    
    // We do multiple related reads and writes on the DB
    // so wrap in a transaction for safety
    const data = await db.transaction(async safeDb => {
      const game = new Game(db, 
                            parseInt(request.params.gameId), 
                            { secret: request.header(PLAYER_SECRET_HEADER) });

      // Record the user's answer and update game state
      const { answer, score } = request.body;
      await game.answerProblem(request.params.problemId, parseInt(answer), parseInt(score));

      // Generate the next problem now
      await game.generateNextProblem();

      // Get the game state and return it
      return await(game.getEverythingPlayerCanSee()) || {};
    });
    
    respondWithData(response, data);
  }
  catch(error) {
    respondWithError(response, error, { log: true });
  }
};

module.exports = { createGame, getGame, answerProblem};

