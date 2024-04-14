import Dexie from 'dexie';
import { generateProblems, filterProblems, jackpotForProblem } from './util/problems';

// This version allows the game to run fully locally with no server
// We don't get centralized tracking of how well players are doing, or let players
// remotely watch others playing, but it's much easier to host
class LocalApi {
    constructor(session) {
        this.session = session;
        this.db = new Dexie("GameDatabase");

        this.db.version(1).stores({
            games: '++id, secret, created_at, completed_at, level, score, min, max, hearts',
            problems: '++id, game_id, a, b, answer, correct, jackpot, score, answered_at, created_at'
        });

        this.setupDatabase();
    }

    setupDatabase() {
        this.db.open().catch(err => {
            console.error(`Open failed: ${err.stack}`);
        });
    }

    async setupGame() {
        if (this.session.gameId && this.session.gameId > 0) {
            return await this.getSnapshot();
        }

        const snapshot = await this.setupNewGame();
        if (this.onNewGame && snapshot && snapshot.game) {
            this.onNewGame(snapshot.game.id);
        }

        // Generate the first problem
        await this.generateNextProblem();

        // Get another snapshot
        return await this.getSnapshot();
    }

    async setupNewGame() {
        const secret = Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15);
        const newGame = {
            ...this.session.rules,
            created_at: new Date(),
            secret: secret,
            score: 0,
            level: this.session.level
        };
        const gameId = await this.db.games.add(newGame);

        this.session.gameId = gameId;
        this.session.secret = secret;

        return {
            game: {
                id: gameId,
                ...newGame
            },
            player: {
                action: "playing",
                secret: secret
            },
            problems: [] // Initially no problems
        };
    }

    async generateNextProblem() {
        const game = await this.db.games.get(this.session.gameId);
        const problems = await this.db.problems.where({ game_id: this.session.gameId }).toArray();

        const {min, max} = game;
        const allProblems = generateProblems(min, max);
        const novelProblems = filterProblems(allProblems, problems);
        if (novelProblems.length > 0) {
            const nextProblem = novelProblems[0];
            const jackpot = jackpotForProblem(nextProblem, min, max);
            await this.db.problems.add({
                game_id: this.session.gameId,
                a: nextProblem.a,
                b: nextProblem.b,
                jackpot,
                created_at: new Date()
            });
        }
        else {
            // Game is over
            await this.db.games.update(game.id, { completed_at: new Date() });
        }
    }

    async answerProblem(problem) {
        const isCorrect = problem.a * problem.b === problem.answer;
        await this.db.problems.update(problem.id, {
            answer: problem.answer,
            score: isCorrect ? problem.score : 0,
            correct: isCorrect,
            answered_at: new Date()
        });

        // Update the game score as well, by taking the problem score if correct and adding to the game score
        const game = await this.db.games.get(this.session.gameId);
        const newScore = game.score + (isCorrect ? problem.score : 0);
        await this.db.games.update(game.id, { score: newScore });

        // Generate the next problem
        await this.generateNextProblem();

        // Fetch updated snapshot
        return await this.getSnapshot();
    }

    async getSnapshot() {
        const game = await this.db.games.get(this.session.gameId);
        const problems = await this.db.problems.where({ game_id: this.session.gameId }).toArray();

        // Count the # of mistakes
        const mistakes = problems.filter(problem => problem.answered_at && !problem.correct);
        
        // Figure out what action the player should have
        const currentAction = () => {
            if ( mistakes.length >= game.hearts ) {
                return 'crying';
            }
            else if ( game.completed_at ) {
                return 'celebrating';
            }
            else {
                return 'playing'
            }
        }

        return {
            game: {
                ...game,
                id: this.session.gameId
            },
            player: {
                action: currentAction(),
                secret: this.session.secret
            },
            problems
        };
    }
}

export default LocalApi;
