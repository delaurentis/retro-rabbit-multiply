const { requestByPlayerWithSecret,
        setupCustomExpectations } = require('./utils');

// Since we're doing an integration test,
// let's track state between tests
let state = {};

// Setup our custom .expect calls
setupCustomExpectations();

// Make it really easy to simulate either player
const requestByPlayer = async (method, url, options) => { return await requestByPlayerWithSecret(state.secretForPlayer, method, url, options); };

// The first set of tests is about setting up the match
describe('Plays a Game', () => {
  
  it('creates a new game', async () => {

    // Send the api request
    const rules = { min: 2, max: 9, hearts: 3 };
    const data = await requestByPlayer('POST', '/api/game', { log: false, body: rules });

    // Make sure it create a match, and the right # of ships
    expect(data.game.id).toBeGreaterThan(0);
    expect(data).not.toHaveError();
    expect(data.player.secret).toBeDefined();

    // Store the match ID and secret into our state
    state.gameId = data.game && data.game.id;
    state.secretForPlayer = data.player && data.player.secret;
    
    // There's a problem already there, and it's blank
    expect(data.problems).toBeDefined();
    expect(data.problems.length).toBe(1);
    expect(data.problems[0].a).toBeBetween(2, 9);
    expect(data.problems[0].b).toBeBetween(2, 9);
    expect(data.problems[0].answer).toBeUndefined();
    
    // Record that problem
    state.problem = data.problems[0];
  });
  
  it('can be read from API', async () => {

    // Send the api request
    const data = await requestByPlayer('GET', `/api/game/${state.gameId}`, { log: false });

    // Make sure the game # is the same, and we have the right # of ships
    expect(data.game.id).toBe(state.gameId);
    
    // There's a problem already there, and it's the same as the first
    expect(data.problems).toBeDefined();
    expect(data.problems.length).toBe(1);
    expect(data.problems[0].a).toBe(state.problem.a);
    expect(data.problems[0].b).toBe(state.problem.b);
    expect(data.problems[0].answer).toBeUndefined();
  });
  
  it('records a correct answer', async () => {

    // Send the api request
    const body = { answer: state.problem.a * state.problem.b, score: 4 };
    const data = await requestByPlayer('PUT', `/api/game/${state.gameId}/problem/${state.problem.id}`, { log: false, body: body });

    // Shouldn't be an error
    expect(data).not.toHaveError();
 
    // Bin our problems into answered and unanswerd
    const answeredProblems = data.problems.filter(problem => !!problem.answer);
    const newProblems = data.problems.filter(problem => !problem.answer);
        
    // Make sure there' a new problem
    expect(answeredProblems.length).toBe(1);
    expect(answeredProblems[0].correct).toBeTruthy();
    expect(answeredProblems[0].answer).toBe(state.problem.a * state.problem.b);
    expect(answeredProblems[0].score).toBe(4);
    expect(newProblems.length).toBe(1);
    
    // Record the next problem
    state.problem = newProblems[0];

  });  
  
  it('records a wrong answer', async () => {
    
    // Send the api request
    const mistake = (state.problem.a + 1) * state.problem.b;
    const body = { answer: mistake, score: 2 };
    const data = await requestByPlayer('PUT', `/api/game/${state.gameId}/problem/${state.problem.id}`, { log: false, body: body });

    // Shouldn't be an error
    expect(data).not.toHaveError();
 
    // Bin our problems into answered and unanswerd
    const answeredProblems = data.problems.filter(problem => !!problem.answer);
    const newProblems = data.problems.filter(problem => !problem.answer);
    
    // Make sure there' a new problem
    expect(answeredProblems.length).toBe(2);
    expect(answeredProblems[0].correct).toBeTruthy();
    expect(answeredProblems[0].score).toBe(4);
    expect(answeredProblems[1].answer).toBe(mistake);
    expect(answeredProblems[1].correct).not.toBeTruthy();
    expect(newProblems.length).toBe(1);
    
    // Record the next problem
    state.problem = newProblems[0];

  });
  
});

