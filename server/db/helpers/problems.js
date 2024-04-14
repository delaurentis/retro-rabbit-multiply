const { shuffle } = require('../../util');

// Create problems
const generateProblems = (min, max) => {

  // Get all our possible multiplications
  const numbersInRange = (min, max) => Array.from({length: max - 1}, (value, index) => index + min);
  const rows = numbersInRange(min, max);
  const columns = numbersInRange(min, max);

  // Create an array of problems
  const problems = rows.reduce((problems, row) => {
    return columns.reduce((problemsForColumns, column) => {
      return problemsForColumns.concat({ a: row, b: column });
    }, problems);
  }, []);

  // Shuffle the problems
  return shuffle(problems);
};

// This will filter out problems
const filterProblems = (problems = [], answeredProblems = []) => {

  // This hash will help us find matches in O(N)
  const keyForProblem = (problem) => `${problem.a}x${problem.b}`;
  const isAnswered = answeredProblems.reduce((hash, problem) => {
    hash[keyForProblem(problem)] = true;
    return hash;
  }, {});

  // Remove any problems already answered
  const unsolvedProblems = problems.filter(problem => !isAnswered[keyForProblem(problem)]);
  return unsolvedProblems;   
};
  
// Give a jackpot for the problem between 3 and 2 carrots
const jackpotForProblem = (problem, min, max) => {
  return Math.round(3 + (4 * difficultyForProblem(problem, min, max)));
};

// Tell us how hard a problem is
const difficultyForProblem = (problem, min, max) => {
  return (problem.a * problem.b) / (max * max)
};

module.exports = { generateProblems, filterProblems, jackpotForProblem, difficultyForProblem };