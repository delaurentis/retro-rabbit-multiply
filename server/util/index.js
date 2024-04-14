const { shuffle } = require('./shuffle');

// This will redirect any HTTP to HTTPS
const redirectToHttps = (app) => {

  // This method will be used below to force HTTPS on any requests
  function checkHttpsAndRedirectIfNeeded(request, response, next) {
    // Check the protocol — if http, redirect to https.
    if (request.get('X-Forwarded-Proto')?.indexOf('https') != -1) {
      return next();
    } else {
      response.redirect('https://' + request.hostname + request.url);
    }
  }

  // Force HTTPS
  app.all('*', checkHttpsAndRedirectIfNeeded);
}

// Keep trying, but inform code we run of how many attempts so far
const keepAttempting = (handler) => {
  
  // Allow inside of loop to exit
  let attemptCount = 1;
  while(true) {

    // We only exit if there was a result from the handler
    // If it's undefined we keep on chugging
    const result = handler(attemptCount);
    if ( result ) { return result; }
    
    // Track attempts
    attemptCount += 1;
  }
};

module.exports = { redirectToHttps, shuffle };