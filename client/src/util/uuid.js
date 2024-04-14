/* eslint no-mixed-operators: 0 */

// Generate a unique UUID 
// (Courtesy of https://stackoverflow.com/questions/105034/how-to-create-guid-uuid)
const uuidv4Legacy = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate crypto-graphically safe using the browser built-in crypto library
// (Courtesy of https://stackoverflow.com/questions/105034/how-to-create-guid-uuid)
export const uuidv4 = () => {
  if ( crypto && crypto.getRandomValues ) {
    
    // Use true randomization if it's available
    // We take our Battleship security seriously!
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  else { 
    
    // Otherwise fallback to the legacy version
    // which is a bit more predictable
    return uuidv4Legacy(); 
  }
}

