import { OneButtonZone } from '../components/1_Button/OneButtonZone.js';
import { QuadrantButtonZone } from '../components/4_Button/QuadrantButtonZone.js';

let buttonA, buttonB, buttonX, buttonY;

function renderFourButtonLayout(data) {
  clearButtonReferences();

  buttonA = new QuadrantButtonZone({
    label: 'A',
    variant: 'bottom',
  });

  buttonB = new QuadrantButtonZone({
    label: 'B',
    variant: 'right',
  });

  buttonX = new QuadrantButtonZone({
    label: 'X',
    variant: 'left',
  });

  buttonY = new QuadrantButtonZone({
    label: 'Y',
    variant: 'top',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
  buttonContainer.appendChild(buttonX.getElement());
  buttonContainer.appendChild(buttonY.getElement());
}

function renderThreeButtonLayout(data) {
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
console.log('called in renderonebuttonlayout');

  buttonA = new OneButtonZone({
    label: 'A',
    variant: 'singular',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  buttonContainer.appendChild(buttonA.getElement());
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
  if (buttonY) {
    buttonY.destroy();
    buttonY = null;
  }
}

export {
  renderOneButtonLayout,
  renderThreeButtonLayout,
  renderFourButtonLayout
}