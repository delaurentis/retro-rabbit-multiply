// Return a clean JSON string with any nulls removed
// SQLite uses nulls for any blank fields instead of undefined
// and it looks much cleaner in the JSON to exclude them
const toCleanJSON = (data) => {
  return (JSON.stringify(data, (key, value) => {
    if (value !== null) return value;
  }));
};

// Respond with the given error info
const respondWithError = (response, error, options) => {
  
  // Log locally if we hit an error
  if ( options && options.log ) { 
    console.log('Error: ', error);
  }

  // This could happen if they didn't give either
  // player's correct secret for the match
  response.send(toCleanJSON({ error: { type: error.type, message: error.message }}));
};

// Respond with the given data
const respondWithData = (response, data) => {
  response.send(toCleanJSON(data));
}

module.exports = {toCleanJSON, respondWithError, respondWithData};