import { OneButtonZone } from '../1_Button/OneButtonZone.js';

/**
 * A configurable diamond, standard-looking button with color changing tap states, designed for a 4-Button layout.
*/
export class DiamondButton extends OneButtonZone {
  constructor(config = {}) {
    const fourButtonConfig = {
      variant: 'bottom', // bottom, top, left, right
      ...config
    }
    super(fourButtonConfig);
    this.element.className = `diamond-button diamond-button--${this.config.variant}`;
  }
}
