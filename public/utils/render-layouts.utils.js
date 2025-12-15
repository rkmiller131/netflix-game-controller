import { OneButtonZone } from '../components/1_Button/OneButtonZone.js';
import { QuadrantButtonZone } from '../components/4_Button/QuadrantButtonZone.js';
import { DiamondButton } from '../components/4_Button/DiamondButton.js';

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

  // buttonA = new DiamondButton({
  //   label: 'A',
  //   variant: 'bottom',
  // });

  // buttonB = new DiamondButton({
  //   label: 'B',
  //   variant: 'right',
  // });

  // buttonX = new DiamondButton({
  //   label: 'X',
  //   variant: 'left',
  // });

  // buttonY = new DiamondButton({
  //   label: 'Y',
  //   variant: 'top',
  // });

  const buttonArea = document.getElementById('button-area');
  const buttonContainer = document.getElementById('button-container');
  if (!buttonArea) throw new Error('Wrapper div with id: "button-area" is required but could not be found!');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  // The button area normally centers the button, but for multi-zones, align to the right.
  buttonArea.style.justifyContent = 'flex-end';

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

  buttonA = new OneButtonZone({
    label: 'A',
    variant: 'singular',
  });

  const buttonContainer = document.getElementById('button-area');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-area" is required but could not be found!');

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