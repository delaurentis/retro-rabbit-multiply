class Session {
  
  // Create an API object
  constructor(gameId, type, level, rules) {
    
    // Store the game ID if there is one
    // and the type: whether we're a human or AI
    this.gameId = gameId;
    this.type = type;
    this.rules = rules;
    this.level = level;

    // Once we start requesting a game ID, but before we get one
    // then we may be in a state where we don't want to request again
    this.hasRequestedGameId = false;
    
    // If we have a game ID, then lookup the secret
    // Otherwise, we'll be creating a brand new secret
    this.secret = this.getExistingSecret();
  }
  
  // Retrieve secret for this player for  
  // this game from local storage
  getExistingSecret() {
    if ( this.gameId ) {
      return window.localStorage.getItem(this.keyForSecretStorage());
    }
  }
  
  // Store our secret, so it's refresh safe
  storeSecretForGame() {
    if ( this.gameId && this.secret ) {
      window.localStorage.setItem(this.keyForSecretStorage(), this.secret);
    } 
  }
  
  // Compute the key for our secret storage
  keyForSecretStorage() {
    return `${this.type}SecretForGame${this.gameId}`;
  }
  
  // If we have a game ID already, or have requested one already
  // there is no need to setup again
  isSetupNeeded() {
    return !this.gameId && !this.hasRequestedGameId
  }
}

export default Session;