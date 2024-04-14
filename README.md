# Retro Rabbit: Multiply

![Rabbit](https://multiply.retrorabbit.games/logo-medium.gif)

## How to Play

Retro is the rabbit is learning how to multiply.  Help Retro by answering randomly chosen multiplication tables at a difficulty of Easy, Medium, or Hard.  The faster you answer, the more carrots Retro gets.  But don't go too fast ... if you get 3 problems wrong in a row, the game ends, and you'll need to start over.

You can play the game at: https://multiply.retrorabbit.games

## Background

Retro Rabbit Multiply is game written in React, optionally backed by a Node.js server. We made this game to help Emma (age 10) learn her multiplication tables, and for Sofia (age 12) and Jack (age 8) to learn to code.

## Under the Hood

The game can run fully in the front-end (for easy deployment) or with an optional back-end that keeps track of kids' answers in the cloud (when played from multiple devices).  Either locally, or in the cloud, answers are stored in a database which can be queried to understand common patterns.

## Client Version

Run in client-only mode (without a server), and store games in the browser's built in databases:

```
npm install
npm run client
```

## Fullstack Version

Run a client and server and store game history in a server database.

```
npm install
npm run fullstack
```

## Server API

Please see API.md for a reference on the API used.  Here's one example command for starting a new game:

```
POST /api/game
RESPONSE 200
{
  game: { id: 143, score: 4, min: 2, max: 9, hearts: 3 },
  player: {
    action: 'playing'
  },
  problems: [
    { id: 1001, a: 5, b: 8, answer: 40, jackpot: 9, score: 4 },
    ...
  ]
}
```

## Credits

Code by Pete DeLaurentis, Sofia DeLaurentis, and Jack DeLaurentis

Artwork by Sofia DeLaurentis, and Jack DeLaurentis

Testing by Emma DeLaurentis

