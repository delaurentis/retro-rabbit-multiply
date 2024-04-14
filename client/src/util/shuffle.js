// Get a random number in a given range
const randomInRange = (min, max) => {
    return min + Math.floor(Math.random() * (1 + (max - min)));      
  };
  
  // Do a Fisher Yates shuffle, an O(n) in-place shuffle algorithm
  // which is the gold standard for fast randomization
  // If you want to learn more about the shuffle, here's the 
  // best site to visualize it's performance:
  // https://bost.ocks.org/mike/shuffle/
  const shuffleInPlace = (array) => {
    
    // Iterate backward through the whole array
    let lastIndex = array.length;
    while ( lastIndex-- ) {
      
      // Pick another element that's definitely not this element
      // Because we don't want to swap with ourselves
      // that's why we subtract another 1 from it here
      const randomIndex = randomInRange(0, lastIndex - 1);
      
      // Swap the elemxent
      const temporaryValue = array[lastIndex];
      array[lastIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;  
  }
  
  // We generally want to be immutable, so let's make a copy of our array 
  export const shuffle = (array) => {
    return shuffleInPlace([...array]);
  }
  
  