const createTables = async (db) => {
  
  // Games
  await db.run('CREATE TABLE games (\
                id               INTEGER PRIMARY KEY AUTOINCREMENT, \
                secret           TEXT, \
                created_at       DATETIME, \
                completed_at     DATETIME, \
                level            TEXT, \
                score            INTEGER DEFAULT 0, \
                min              INTEGER DEFAULT 2, \
                max              INTEGER DEFAULT 9, \
                hearts           INTEGER DEFAULT 3 \
               )');

  // Problems
  await db.run('CREATE TABLE problems (\
                id               INTEGER PRIMARY KEY AUTOINCREMENT, \
                game_id          INTEGER, \
                a                INTEGER, \
                b                INTEGER, \
                answer           INTEGER, \
                correct          BOOLEAN, \
                jackpot          INTEGER DEFAULT 0, \
                score            INTEGER DEFAULT 0, \
                answered_at      DATETIME, \
                created_at       DATETIME \
               )');

};

// Create our indexes
const createIndexes = async (db) => {
  await db.run('CREATE INDEX idx_games_secret ON games (secret)');
  await db.run('CREATE INDEX idx_games_problems ON problems (game_id)');
  await db.run('CREATE INDEX idx_games_correct_problems ON problems (game_id, correct)');
}

// Populate any constant tables
const populateConstantTables = async (db) => {
}

module.exports = { createTables, createIndexes, populateConstantTables };