import { gameMessage } from '../sdk/index.js';
import { AdvancedSwipeHexagonButton } from '../components/3_Button/AdvancedSwipeHexagonButton.js';
import { BeginnerSwipeHexagonButton } from '../components/2_Button/BeginnerSwipeHexagonButton.js';
import { OneButtonHexagon } from '../components/1_Button/OneButtonHexagon.js';
import { TwoButtonHexagon } from '../components/2_Button/TwoButtonHexagon.js';

let buttonA, buttonB, buttonX;

function renderAdvancedSwipeLayout(data) {
  clearButtonReferences();

  let startingPosition;
  if (data && data.position) {
    startingPosition = data.position;
  } else {
    startingPosition = 'offense';
  }

  buttonA = new AdvancedSwipeHexagonButton({
    label: 'A',
    position: startingPosition,
    variant: 'primary',
  });

  buttonB = new AdvancedSwipeHexagonButton({
    label: 'B',
    position: startingPosition,
    variant: 'secondary',
  });

  buttonX = new AdvancedSwipeHexagonButton({
    label: 'X',
    position: startingPosition,
    variant: 'tertiary',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
  buttonContainer.appendChild(buttonX.getElement());
}

function renderBeginnerSwipeLayout(data) {
  clearButtonReferences();

  let startingPosition;
  if (data && data.position) {
    startingPosition = data.position;
  } else {
    startingPosition = 'offense';
  }

  buttonA = new BeginnerSwipeHexagonButton({
    label: 'A',
    position: startingPosition,
    variant: 'primary',
  });

  buttonB = new BeginnerSwipeHexagonButton({
    label: 'B',
    position: startingPosition,
    variant: 'secondary',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
}

function renderOneButtonLayout(data) {
  clearButtonReferences();
  // If the game wants to switch layout like contexts, can use the
  // position attribute and setPosition method when switching between
  // offense/defense. If, however, the game just receives "button A was pressed"
  // and has all the context switching logic within unreal blueprints, pass in
  // "none" for the position.
  let startingPosition;
  if (data && data.position) {
    startingPosition = data.position;
  } else {
    startingPosition = 'none';
  }

  buttonA = new OneButtonHexagon({
    label: 'A',
    position: startingPosition,
    variant: 'singular',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  buttonContainer.appendChild(buttonA.getElement());
}

function renderTwoButtonLayout(data) {
  clearButtonReferences();
  // If the game wants to switch layout like contexts, can use the
  // position attribute and setPosition method when switching between
  // offense/defense. If, however, the game just receives "button A was pressed"
  // and has all the context switching logic within unreal blueprints, pass in
  // "none" for the position.
  let startingPosition;
  if (data && data.position) {
    startingPosition = data.position;
  } else {
    startingPosition = 'none';
  }

  buttonA = new TwoButtonHexagon({
    label: 'A',
    position: startingPosition,
    variant: 'primary'
  });

  buttonB = new TwoButtonHexagon({
    label: 'B',
    position: startingPosition,
    variant: 'secondary'
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
}

function updateButtonPosition(data) {
  if (!buttonA || !data.position) return;

  buttonA.setPosition(data.position);

  if (buttonB) {
    buttonB.setPosition(data.position);
  }

  if (buttonX) {
    buttonX.setPosition(data.position);
  }
}

function clearButtonReferences() {
  if (buttonA) {
    buttonA.destroy();
    buttonA = null;
  }
  if (buttonB) {
    buttonB.destroy();
    buttonB = null;
  }
  if (buttonX) {
    buttonX.destroy();
    buttonX = null;
  }
}

export {
  renderAdvancedSwipeLayout,
  renderBeginnerSwipeLayout,
  renderOneButtonLayout,
  renderTwoButtonLayout,
  updateButtonPosition
}