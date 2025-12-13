import { GamepadButton } from '../sdk/index.js';

function mapLabelToGamepadButton(label) {
  const buttonMap = {
    'A': GamepadButton.BTN_A,
    'B': GamepadButton.BTN_B,
    'X': GamepadButton.BTN_X,
    'Y': GamepadButton.BTN_Y
  };
  if (label in buttonMap) {
    return buttonMap[label];
  } else {
    console.error(`Button label "${label}" not found in GamepadButton map`);
    return null;
  }
}

function parseGameMessage(data) {
  let parsedData;

  if (typeof data === 'string') {
    // If it's a string, assume JSON and parse it
    try {
      parsedData = JSON.parse(data);
    } catch (err) {
      console.error('Failed to parse gameMessage string:', err);
      return null;
    }
  } else if (data instanceof Uint8Array || ArrayBuffer.isView(data)) {
    // If it's a byte array, decode it to a string first
    try {
      const textDecoder = new TextDecoder(); // defaults to utf-8
      const jsonString = textDecoder.decode(data);
      parsedData = JSON.parse(jsonString);
    } catch (err) {
      console.error('Failed to decode/parse gameMessage bytes:', err);
      return null;
    }
  } else {
    console.warn('Unknown gameMessage type:', typeof data);
    return null;
  }
  return parsedData;
}

export {
  mapLabelToGamepadButton,
  parseGameMessage
}