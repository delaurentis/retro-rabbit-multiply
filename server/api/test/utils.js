// In the browser fetch() is already there
// but in node.js we need to polyfill it
//const fetch = require('node-fetch');
//const fetch = require('node-fetch');
import fetch from 'cross-fetch';

// Process a request by the given player
const requestByPlayerWithSecret = async (playerSecret, method, url, options = {}) => {

  // Figure out the right server and support both glitch and also localhost running on a port
  // If running locally, make sure that the PORT environment variable is set in .env
  const server = process.env.PROJECT_DOMAIN ? 
                 `https://${process.env.PROJECT_DOMAIN}.glitch.me` : 
                 `http://127.0.0.1:${process.env.PORT || 3000}`;

  // Optionally log our HTTP request
  if ( options.log ) {
    const optionalBody = options.body ? `\n${JSON.stringify(options.body, null, 2)}` : '';
    console.log(`${method} ${server}${url}${optionalBody}`);
  }
  
  // Send our API request
  const result = await fetch(
    `${server}${url}`,
    { method: method, 
      body: JSON.stringify(options.body), 
      headers: { 'Content-Type': 'application/json',
                 'Player-Secret': playerSecret } }
  );

  // We may not get any data at all
  if ( !result.ok ) {
    return undefined;
  }
  
  // Parse the JSON into objects
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
};


// Custom matchers to make oiur API test more readable and less redundant
const setupCustomExpectations = () => {
  expect.extend({

    // Make sure there's an error returned
    toHaveError(data) {
      if ( data.error ) {
        return { pass: true, message: () => 'Expected NOT to have received an error.' };      
      }
      else {
        return { pass: false, message: () => 'Expected to have received an error.' };      
      }
    },
    
    // To be between two numbers
    toBeBetween(data, min, max) {
      if ( data >= min && data <= max ) {
        return { pass: true, message: () => `Expected NOT to be between ${min} and ${max}.` };      
      }
      else {
        return { pass: false, message: () => `Expected to be between ${min} and ${max}.` };      
      }
    }

  });
}

// Export the two shortcut methods and the one flexible one (in case we want to test bad secrets)
module.exports = {requestByPlayerWithSecret, 
                  setupCustomExpectations};

