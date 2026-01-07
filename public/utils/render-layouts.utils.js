import { OneButtonZone } from '../components/1_Button/OneButtonZone.js';
import { ThreeButtonZone } from '../components/3_Button/ThreeButtonZone.js';
import { QuadrantButtonZone } from '../components/4_Button/QuadrantButtonZone.js';
import { DiamondButton } from '../components/4_Button/DiamondButton.js';

let buttonA, buttonB, buttonX, buttonY;

function renderOneButtonZoneLayout() {
  clearButtonReferences();

  buttonA = new OneButtonZone({
    label: 'A',
    variant: 'singular',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');
  console.log(buttonContainer)

  buttonContainer.appendChild(buttonA.getElement());
}

function renderThreeButtonZoneLayout() {
  clearButtonReferences();

  buttonA = new ThreeButtonZone({
    label: 'A',
    variant: 'bottom',
  });

  buttonB = new ThreeButtonZone({
    label: 'B',
    variant: 'right',
  });

  buttonX = new ThreeButtonZone({
    label: 'X',
    variant: 'left',
  });

  const buttonContainer = document.getElementById('button-container');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

  // For the tri-zone configuration, the button container needs to be a circle (buttons are like wedges of a pie shape)
  buttonContainer.style.borderRadius = '50%';

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
  buttonContainer.appendChild(buttonX.getElement());
}

function renderFourButtonZoneLayout() {
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

  const buttonArea = document.getElementById('button-input-area');
  const buttonContainer = document.getElementById('button-container');
  if (!buttonArea) throw new Error('Wrapper div with id: "button-input-area" is required but could not be found!');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');
  buttonArea.style.justifyContent = 'flex-end';

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
  buttonContainer.appendChild(buttonX.getElement());
  buttonContainer.appendChild(buttonY.getElement());
}

function renderFourButtonDiamondLayout() {
  clearButtonReferences();

  buttonA = new DiamondButton({
    label: 'A',
    variant: 'bottom',
  });

  buttonB = new DiamondButton({
    label: 'B',
    variant: 'right',
  });

  buttonX = new DiamondButton({
    label: 'X',
    variant: 'left',
  });

  buttonY = new DiamondButton({
    label: 'Y',
    variant: 'top',
  });

  const buttonArea = document.getElementById('button-input-area');
  const buttonContainer = document.getElementById('button-container');
  if (!buttonArea) throw new Error('Wrapper div with id: "button-input-area" is required but could not be found!');
  if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');
  buttonArea.style.justifyContent = 'flex-end';

  buttonContainer.appendChild(buttonA.getElement());
  buttonContainer.appendChild(buttonB.getElement());
  buttonContainer.appendChild(buttonX.getElement());
  buttonContainer.appendChild(buttonY.getElement());
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
  renderOneButtonZoneLayout,
  renderThreeButtonZoneLayout,
  renderFourButtonZoneLayout,
  renderFourButtonDiamondLayout
}