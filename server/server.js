const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {setupApi} = require('./api');
const {setupDatabase, dropDatabase} = require('./db');
const {redirectToHttps} = require('./util');

// Setup our database and API and express server
const setupServer = async () => {

  // Uncomment for clean start
  // dropDatabase();
  
  // This will create a sqlite file if one doesn't exist.
  const db = await setupDatabase();

  // Setup our app server to parse JSON request bodies
  const app = express();
  app.use(bodyParser.json());

  // Force HTTPs in production, but avoid needing a certificate for development
  if ( process.env.NODE_ENV === 'production' ) {
    redirectToHttps(app);
  }

  // Setup the API endpoints (see api/index.js)
  // and have them powered by the DB
  setupApi(app, db);

  // Express port-switching logic, which helps this CRA apps run on Glitch.
  // To learn more about this neat trick, please read: 
  // https://dev.to/glitch/create-react-app-and-express-together-on-glitch-28gi
  let port;
  if (process.env.NODE_ENV === 'production') {
    port = process.env.PORT || 3000;
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', (request, response) => {
      response.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
  } else {
    port = 3001;
    app.use(express.static(path.join(__dirname, '../public')));  // Serving static files in development
    console.log('⚠️ Not seeing your changes as you develop?');
    console.log(
      '⚠️ Do you need to set \'start\': \'npm run development\' in package.json?'
    );
  }

  // Start the listener!
  const listener = app.listen(port, () => {
    console.log('❇️ Express server is running on port', listener.address().port);
  });
}

// Run it now
setupServer();


