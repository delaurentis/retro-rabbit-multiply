// Adapted from code by: https://josephkhan.me/javascript-copy-clipboard-safari/

// Copies to clipboard, with special workaround for iOS
export const copyToClipboard = (textToCopy) => {

  // Create a fake text area 
  const fakeTextArea = createTextArea(textToCopy);

  // This part requires iOS specific code
  selectText(fakeTextArea);
  
  // Copy the selection to the clipboard
  copySelectionFrom(fakeTextArea);
  
  // Cleanup the fake element
  deleteTextArea(fakeTextArea)
}

const createTextArea = (textToCopy) => {
  const textArea = document.createElement('textArea');
  textArea.readOnly = true;
  textArea.contentEditable = true;
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  return textArea;
}

// Select the given text
const selectText = (textArea) => {
  const iOS = navigator.userAgent.match(/ipad|iphone|ipod/i);
  if ( iOS ) {
    
    // iOS doesn't make this super easy
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } 
  else {
    
    // Everywhere else it's a single line
    textArea.select();
  }
}

// Copy the given text area 
const copySelectionFrom = (textArea) => { document.execCommand('copy'); }

// Cleanup when we're done
const deleteTextArea = (textArea) => { document.body.removeChild(textArea); }

