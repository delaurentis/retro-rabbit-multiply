const fs = require('fs');
const sqlite3 = require('sqlite3');
const {createTables, createIndexes, populateConstantTables} = require('./schema');

// Database file location
const dbFile = './sqlite.db';

// Drop our database
const dropDatabase = () => {

  // Check if the DB exists before we try to drop it
  const databaseDidExist = fs.existsSync(dbFile);
  if ( databaseDidExist ) {

    // Force re-creation of the database file
    fs.unlinkSync(dbFile);
  }
};

// Setup our sqlite database
const setupDatabase = async () => {
  
  // Check if the DB exists before we try to open it
  // since that will auto-create it
  const databaseDidExist = fs.existsSync(dbFile);
  
  // Open or create our database now
  const sqliteAsync = await import('sqlite-async');
  const db = await sqliteAsync.Database.open(dbFile);
  
  // If the DB is new, we need to setup the schema
  if (!databaseDidExist) {
    await createTables(db);
    await createIndexes(db);
    await populateConstantTables(db);
  }
  
  return db;
};

module.exports = { setupDatabase, dropDatabase };
