class Api {
  
  // Create an API object
  constructor(session) {
    
    // We always wrap our API around a session
    this.session = session;
  }
  
  // Start the game: creating or joining as needed
  async setupGame() {
    
    // If we already have a match, just return it
    if ( this.session.gameId > 0 ) {
      return await this.getSnapshot();
    }
    else if ( !this.session.hasRequestedGameId ) {
    
      // This is used to debounce multiple attempts to start a game
      this.session.hasRequestedGameId = true;

      // If we didn't already have a match, setup a new one
      const snapshot = await this.setupNewGame();
      
      // Notify our callback if there is one
      // It might use this to update our browser URL to reflect the new game
      if ( this.onNewGame && snapshot && snapshot.game ) {
        this.onNewGame(snapshot.game.id)
      }
      
      // Return a snapshot of the new match
      return snapshot;
    }
    return undefined;
  }
  
  // Creates the match
  async setupNewGame() {

    // Create a new game
    const snapshot = await this.createGame();
    this.session.gameId = snapshot.game.id;
    this.session.secret = snapshot.player.secret;

    // Store the secret in local storage 
    // (associated with this game ID)
    this.session.storeSecretForGame();
    
    // Return the current state of the game (first problem should be in)
    return snapshot;
  }
  
  // Get a snapshot of the game
  async getSnapshot() {
    return await this.request('GET', `/api/game/${this.session.gameId}`, { log: false });
  }
                                                                        
  // Create a new match
  async createGame() {
    return await this.request('POST', `/api/game`, { log: false, body: { ...this.session.rules, level: this.session.level }});
  }
  
  // Answer a problem
  async answerProblem(problem) {
    const body = { answer: problem.answer, score: problem.score };
    return await this.request('PUT', `/api/game/${this.session.gameId}/problem/${problem.id}`, { log: false, body });
  }
  
  // Process a request by this player
  async request(method, url, options = {}) {

    // Optionally log our HTTP request
    if ( options.log ) {

      // Log that we're sending the request
      console.log(`${method} ${url}\nHEADER Player-Secret: ${this.session.secret}`);
    }

    // Send our API request
    const result = await fetch(url, 
      { method: method, 
        headers: { 'Content-Type': 'application/json', 
                   'Player-Secret': this.session.secret },
        body: options.body ? JSON.stringify(options.body) : undefined }
    );

    // We may not get any data at all
    if ( !result.ok ) {
      return undefined;
    }

    // Parse the JSON into objects which could fail
    try {
      const data = await result.json();

      // Optionally log our object
      if ( options.log ) {
        console.log(JSON.stringify(data, null, 2 /* indentation */ ));
      }

      return data;
    }
    catch(error) {
      return undefined;
    }
  }
}

export default Api;