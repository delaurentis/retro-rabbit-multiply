const { v4: uuidv4 } = require('uuid');
const { generateProblems, filterProblems, jackpotForProblem } = require('../helpers/problems');

class Game {
  
  // All our model objects take in these basics (id is optional)
  constructor(db, id, options = {}) {
    this._db = db;
    this.id = id;
    this.secret = options.secret;
    this.min = options.min;
    this.max = options.max;
    this.hearts = options.hearts;
    this.score = options.score;
    this.level = options.level;
  }
  
  // This creates a brand new match
  static async create(db, min, max, hearts, level) {

    // Create a secret which will be required for anyone to see this game from now on.  
    // we'll be passing back to the client through a response header
    const secret = uuidv4();
    
    // Create a new game, which requires a secret to access
    const values = [new Date(), secret, min, max, hearts, level];
    const result = await db.run('INSERT INTO games (created_at, secret, min, max, hearts, level) VALUES (?, ?, ?, ?, ?, ?)', values); 
    return new Game(db, result.lastID, { secret, min, max, hearts, level });
  }

  // Generate a new problem
  async generateNextProblem(problem) {
    
    // Get the state of the game from the DB
    const data = await this.getEverythingPlayerCanSee();
    
    // Count the # of unanswered problems
    const unanswered = data.problems.filter(problem => !problem.answered_at);
    if ( unanswered.length == 0 ) {
      
      // Generate a problem now 
      const allProblems = generateProblems(data.game.min, data.game.max);
      const novelProblems = filterProblems(allProblems, data.problems);
      const nextProblem = novelProblems[0];
      if ( nextProblem ) {
  
        // Compute a prize relative to the difficulty of the problem
        const jackpot = jackpotForProblem(nextProblem, data.game.min || 2, data.game.max || 9);
        
        // Create the new problem in the DB
        const values = [new Date(), this.id, nextProblem.a, nextProblem.b, jackpot];
        const { lastID } = await this._db.run('INSERT INTO problems (created_at, \
                                                                     game_id, \
                                                                     a, \
                                                                     b, \
                                                                     jackpot) \
                                                                     VALUES (?, ?, ?, ?, ?)', values);
      }
    }
  }
  
  // Record an answer.  Important: must be in a transaction to call.
  async answerProblem(problemId, answer, score) {

    // Make sure the player is the one doing the answering
    const gameInfo = await this._db.get('SELECT score, secret, min, max, hearts, level FROM games WHERE id = ?', [this.id]);
    if ( gameInfo.secret !== this.secret ) {
      throw new Error('Only the player can answer questions.');
    }
    
    // Lookup the problem
    const problem = await this._db.get('SELECT * FROM problems WHERE id = ? LIMIT 1', [problemId]);
    
    // Update the problem
    const isCorrect = (problem.a * problem.b) === answer;
    const problemValues = [answer, score, new Date(), isCorrect, problemId];
    await this._db.run('UPDATE problems SET answer = ?, score = ?, answered_at = ?, correct = ? WHERE id = ?', problemValues);
    
    // Get all the problems in this game
    const allProblems = await this._db.all('SELECT * FROM problems WHERE game_id = ?', [this.id]);
    const unansweredProblems = allProblems.filter(problem => !problem.answered_at);
    const answeredProblems = allProblems.filter(problem => !!problem.answered_at);
    const mistakes = allProblems.filter(problem => problem.answered_at && !problem.correct);

    // Update the game score
    const gameScore = allProblems.reduce((total, problemToScore) => {
      if ( problemToScore.correct ) {
        return total + problemToScore.score;
      }
      return total;
    }, 0);
    
    // Did we answer everything on the board?
    const boardLength = (1 + gameInfo.max) - gameInfo.min;
    const isEverythingAnswered = answeredProblems.length >= (boardLength * boardLength);
    
    // See if the game is over
    const isGameOver = isEverythingAnswered || (mistakes.length >= gameInfo.hearts);
    if ( isGameOver ) {
      await this._db.run('UPDATE games SET completed_at = ?, score = ? WHERE id = ?', [new Date(), gameScore, this.id]);
    }
    else {
      await this._db.run('UPDATE games SET score = ? WHERE id = ?', [gameScore, this.id]);
    }
  }
  
  // Returns the game state for the current player
  async getEverythingPlayerCanSee() {
    
    // Get the game info
    const gameInfo = (await this._db.get('SELECT min, \
                                                 max, \
                                                 score, \
                                                 secret, \
                                                 hearts, \
                                                 level, \
                                                 completed_at \
                                        FROM games \
                                        WHERE id = ?', [this.id])) || {};
    
    // Get all the problems
    const problems = await this._db.all('SELECT id, a, b, answer, correct, jackpot, score, created_at, answered_at \
                                         FROM problems WHERE game_id = ? \
                                         ORDER by created_at ASC', [this.id]);
    
    // Count the # of mistakes
    const mistakes = problems.filter(problem => problem.answered_at && !problem.correct);
    
    // Figure out what action the player should have
    const currentAction = () => {
      if ( mistakes.length >= gameInfo.hearts ) {
        return 'crying';
      }
      else if ( gameInfo.completed_at ) {
        return 'celebrating';
      }
      else if ( gameInfo.secret == this.secret ) {
        return 'playing'
      }
      return 'watching';
    }
    
    // Filter the data down to what this player is allowed to see
    return ({
      game: { id: this.id, 
              min: gameInfo.min, 
              max: gameInfo.max, 
              score: gameInfo.score, 
              level: gameInfo.level,
              hearts: gameInfo.hearts },
      player: { action: currentAction(), secret: this.secret },
      problems: problems
    });
  }
}

module.exports = Game;