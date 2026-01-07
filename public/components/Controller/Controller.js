import { input } from '../../sdk/index.js';
import { mapLabelToGamepadButton } from '../../utils/game-bridge.utils.js';
import { Joystick } from '../Joystick/Joystick.js';
import { TVRemoteButton } from '../TVRemoteButton/TVRemoteButton.js';
import { LayoutSwitchButton } from '../TVRemoteButton/LayoutSwitchButton.js';
import { OneButtonZone } from '../1_Button/OneButtonZone.js';
import { ThreeButtonZone } from '../3_Button/ThreeButtonZone.js';
import { QuadrantButtonZone } from '../4_Button/QuadrantButtonZone.js';
import { DiamondButton } from '../4_Button/DiamondButton.js';

/**
 * The main Controller class, representing one NGC that can switch between
 * different layouts and pop-up menus, mapping user inputs to game actions using the
 * Netflix SDK controller bridge. From UE, pass in puzzle piece messages to change the layout components.
*/
export class Controller {
  constructor(config = {}) {
    this.config = {
      configurations: [
        {
          left: 'joystick',
          right: 'fourButtonDiamond'
        },
        {
          left: 'joystick',
          right: 'oneButtonZone'
        },
        {
          left: 'joystick',
          right: 'threeButtonZone'
        },
        {
          left: 'joystick',
          right: 'fourButtonZone'
        }
      ],
      ...config
    }

    this.layoutButton = new LayoutSwitchButton({
      label: 'LAYOUT',
      parentElementId: 'header',
      maxIndex: this.config.configurations.length,
      onClick: this._handleLayoutMenuClick.bind(this)
    });

    this.tacticsButton = new TVRemoteButton({
      label: 'TACTICS',
      parentElementId: 'footer',
      onClick: this._handleTacticsMenuClick.bind(this)
    });

    this.joystick = null;
    this.dPad = null;

    this.buttonA = null;
    this.buttonB = null;
    this.buttonX = null;
    this.buttonY = null;

    // We will have a set of layouts to switch between, defined in the controller config.
    // In UE blueprints, set up left/right configurations and send in one "configurations" array,
    // else it will cycle through the default configurations above.
    this._renderFirstLayout()
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _renderFirstLayout() {
    const firstLayout = this.config.configurations[0];
    if (!firstLayout.left || !firstLayout.right) {
      console.error('No layout configurations found for Controller - cannot render first layout!');
      console.info('Must instantiate Controller with a "configurations" array containing left/right layout types.');
      return;
    }

    this.switchLayout(firstLayout);
  }

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

  _handleLayoutMenuClick() {
    const currentLayout = this.config.configurations[this.layoutButton.currentLayoutIndex];
    this.switchLayout(currentLayout);
  }

  _renderJoystickLayout() {
    this._clearDirectionalInputReferences();
    this.joystick = new Joystick();
  }

  _renderDPadLayout() {
    this._clearDirectionalInputReferences();
    console.log('Rendering D-Pad layout - NOT YET IMPLEMENTED');
  }

  _renderOneButtonZoneLayout() {
    this._clearButtonInputReferences();

    this.buttonA = new OneButtonZone({
      label: 'A',
      variant: 'singular',
    });

    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

    buttonContainer.appendChild(this.buttonA.getElement());
  }

  _renderThreeButtonZoneLayout() {
    this._clearButtonInputReferences();

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

    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

    // For the tri-zone configuration, the button container needs to be a circle (buttons are like wedges of a pie shape)
    buttonContainer.style.borderRadius = '50%';

    buttonContainer.appendChild(this.buttonA.getElement());
    buttonContainer.appendChild(this.buttonB.getElement());
    buttonContainer.appendChild(this.buttonX.getElement());
  }

  _renderFourButtonZoneLayout() {
    this._clearButtonInputReferences();

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

    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) throw new Error('Wrapper div with id: "button-container" is required but could not be found!');

    buttonContainer.appendChild(this.buttonA.getElement());
    buttonContainer.appendChild(this.buttonB.getElement());
    buttonContainer.appendChild(this.buttonX.getElement());
    buttonContainer.appendChild(this.buttonY.getElement());
  }

  _renderFourButtonDiamondLayout() {
    this._clearButtonInputReferences();

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

  _clearDirectionalInputReferences() {
    if (this.joystick) {
      this.joystick.destroy();
      this.joystick = null;
    }
    if (this.dPad) {
      this.dPad.destroy();
      this.dPad = null;
    }
  }

  _clearButtonInputReferences() {
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

  switchLayout({ left, right }) {
    // RIGHT SIDE BUTTONS
    switch(right) {
      case 'oneButtonZone':
        this._renderOneButtonZoneLayout();
        break;
      case 'threeButtonZone':
        this._renderThreeButtonZoneLayout();
        break;
      case 'fourButtonZone':
        this._renderFourButtonZoneLayout();
        break;
      case 'fourButtonDiamond':
        this._renderFourButtonDiamondLayout();
        break;
      default:
        console.error(`Controller.switchLayout: Unrecognized right layout type: ${right}`);
        return;
    }

    // LEFT SIDE DIRECTIONAL INPUT
    switch(left) {
      case 'joystick':
        this._renderJoystickLayout();
        break;
      case 'dPad':
        this._renderDPadLayout();
        break;
      default:
        console.error(`Controller.switchLayout: Unrecognized left layout type: ${left}`);
        return;
    }
  }

  destroy() {
    this.layoutButton.destroy();
    this.tacticsButton.destroy();
    this._clearDirectionalInputReferences();
    this._clearButtonInputReferences();
  }
}