import { input } from '../../sdk/index.js';
import { mapLabelToGamepadButton } from '../../utils/game-bridge.utils.js';
import { Joystick } from '../Joystick/Joystick.js';
import { TacticsButton } from '../TacticsButton/TacticsButton.js';
import { OneButtonZone } from '../1_Button/OneButtonZone.js';
import { ThreeButtonZone } from '../3_Button/ThreeButtonZone.js';
import { QuadrantButtonZone } from '../4_Button/QuadrantButtonZone.js';
import { DiamondButton } from '../4_Button/DiamondButton.js';

/**
 * The main Controller class, representing one NGC that can switch between
 * different layouts and pop-up menus, mapping user inputs to game actions using the
 * Netflix SDK controller bridge.
*/
export class Controller {
  constructor() {
    // Anything in the footer needs to be rendered first so joystick has proper size calculations
    this.tacticsButton = new TacticsButton({
      label: 'TACTICS',
      onClick: this._handleTacticsMenuClick.bind(this)
    });

    this.joystick = new Joystick();

    this.buttonA = null;
    this.buttonB = null;
    this.buttonX = null;
    this.buttonY = null;

    // Default to the 4 button diamond layout
    this._renderFourButtonDiamondLayout()
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _handleTacticsMenuClick() {
    // this.joystick.toggleTacticsMenu();
    input.setGamepadButton(mapLabelToGamepadButton('Tactics'), true);
    setTimeout(() => {
      // Release Tactics
      input.setGamepadButton(mapLabelToGamepadButton('Tactics'), false);

      // Small delay, then press Up
      setTimeout(() => {
        input.setGamepadButton(mapLabelToGamepadButton('TacticsUp'), true);

        setTimeout(() => {
          // Release Up
          input.setGamepadButton(mapLabelToGamepadButton('TacticsUp'), false);

          // Small delay, then press A to confirm
          setTimeout(() => {
            input.setGamepadButton(mapLabelToGamepadButton('A'), true);

            setTimeout(() => {
              // Release A
              input.setGamepadButton(mapLabelToGamepadButton('A'), false);
              console.log('Tactics menu sequence complete!');
              this.tacticsButton.toggleActive();
            }, 100); // Release A after 100ms
          }, 50); // Wait 50ms before pressing A
        }, 100); // Release Up after 100ms
      }, 50); // Wait 50ms before pressing Up
    }, 150); // Release Tactics after 150ms (menu needs time to open)
  }

  _renderOneButtonZoneLayout() {
    this._clearButtonReferences();

    this.buttonA = new OneButtonZone({
      label: 'A',
      variant: 'singular',
    });

    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

    buttonContainer.appendChild(this.buttonA.getElement());
  }

  _renderThreeButtonZoneLayout() {
    this._clearButtonReferences();

    this.buttonA = new ThreeButtonZone({
      label: 'A',
      variant: 'bottom',
    });

    this.buttonB = new ThreeButtonZone({
      label: 'B',
      variant: 'right',
    });

    this.buttonX = new ThreeButtonZone({
      label: 'X',
      variant: 'left',
    });

    const buttonArea = document.getElementById('button-area');
    const buttonContainer = document.getElementById('button-container');
    if (!buttonArea) throw new Error('Wrapper div with id: "button-area" is required but could not be found!');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

    // The button area normally centers the button, but for multi-zones, align to the right.
    buttonArea.style.justifyContent = 'flex-end';
    // For the tri-zone configuration, the button container needs to be a circle (buttons are like wedges of a pie shape)
    buttonContainer.style.borderRadius = '50%';

    buttonContainer.appendChild(this.buttonA.getElement());
    buttonContainer.appendChild(this.buttonB.getElement());
    buttonContainer.appendChild(this.buttonX.getElement());
  }

  _renderFourButtonZoneLayout() {
    this._clearButtonReferences();

    this.buttonA = new QuadrantButtonZone({
      label: 'A',
      variant: 'bottom',
    });

    this.buttonB = new QuadrantButtonZone({
      label: 'B',
      variant: 'right',
    });

    this.buttonX = new QuadrantButtonZone({
      label: 'X',
      variant: 'left',
    });

    this.buttonY = new QuadrantButtonZone({
      label: 'Y',
      variant: 'top',
    });

    const buttonArea = document.getElementById('button-area');
    const buttonContainer = document.getElementById('button-container');
    if (!buttonArea) throw new Error('Wrapper div with id: "button-area" is required but could not be found!');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');
    buttonArea.style.justifyContent = 'flex-end';

    buttonContainer.appendChild(this.buttonA.getElement());
    buttonContainer.appendChild(this.buttonB.getElement());
    buttonContainer.appendChild(this.buttonX.getElement());
    buttonContainer.appendChild(this.buttonY.getElement());
  }

  _renderFourButtonDiamondLayout() {
    this._clearButtonReferences();

    this.buttonA = new DiamondButton({
      label: 'A',
      variant: 'bottom',
    });

    this.buttonB = new DiamondButton({
      label: 'B',
      variant: 'right',
    });

    this.buttonX = new DiamondButton({
      label: 'X',
      variant: 'left',
    });

    this.buttonY = new DiamondButton({
      label: 'Y',
      variant: 'top',
    });

    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');
    // buttonContainer.style.height = '90%'; // A liiiitle bit smaller for the diamond

    buttonContainer.appendChild(this.buttonA.getElement());
    buttonContainer.appendChild(this.buttonB.getElement());
    buttonContainer.appendChild(this.buttonX.getElement());
    buttonContainer.appendChild(this.buttonY.getElement());
  }

  _clearButtonReferences() {
    if (this.buttonA) {
      this.buttonA.destroy();
      this.buttonA = null;
    }
    if (this.buttonB) {
      this.buttonB.destroy();
      this.buttonB = null;
    }
    if (this.buttonX) {
      this.buttonX.destroy();
      this.buttonX = null;
    }
    if (this.buttonY) {
      this.buttonY.destroy();
      this.buttonY = null;
    }
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
  getElement() {
    return this.element;
  }

  switchLayout(layoutType) {
    if (layoutType === 'oneButtonZone') {
      this._renderOneButtonZoneLayout();
    }
    if (layoutType === 'threeButtonZone') {
      this._renderThreeButtonZoneLayout();
    }
    if (layoutType === 'fourButtonZone') {
      this._renderFourButtonZoneLayout();
    }
    if (layoutType === 'fourButtonDiamond') {
      this._renderFourButtonDiamondLayout();
    }
  }

  destroy() {
    this.joystick.destroy();
    this.tacticsButton.destroy();
    this._clearButtonReferences();
  }
}