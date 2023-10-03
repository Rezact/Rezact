export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function dispatchFocus(inputElement) {
  // Create and dispatch a focus event
  let focusEvent = new FocusEvent("focus", {
    bubbles: true,
    cancelable: true,
  });
  inputElement.dispatchEvent(focusEvent);
}

export function simulateTyping(str, inputElement) {
  // Iterate through each character in the string
  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Create and dispatch a keydown event
    let keydownEvent = new KeyboardEvent("keydown", {
      key: char,
      code: "Key" + char.toUpperCase(),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    inputElement.dispatchEvent(keydownEvent);

    // Create and dispatch a keypress event
    let keypressEvent = new KeyboardEvent("keypress", {
      key: char,
      code: "Key" + char.toUpperCase(),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    inputElement.dispatchEvent(keypressEvent);

    // Add the character to the input value
    inputElement.value += char;

    // Create and dispatch an input event
    let inputEvent = new Event("input", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    inputElement.dispatchEvent(inputEvent);

    // Create and dispatch a keyup event
    let keyupEvent = new KeyboardEvent("keyup", {
      key: char,
      code: "Key" + char.toUpperCase(),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    inputElement.dispatchEvent(keyupEvent);
  }
}

export function dispatchBlur(inputElement) {
  // Create and dispatch a blur event
  let blurEvent = new FocusEvent("blur", {
    bubbles: true,
    cancelable: true,
  });
  inputElement.dispatchEvent(blurEvent);
}
