/*
  This button is based off of the second proposal for a custom layout - tap, double tap, and hold inputs.
  See the following documentation:
  https://drive.google.com/file/d/19NSoiJLbKUWFJhvwTnzL_OE246Z2EeoJ/view
  https://docs.google.com/document/d/1fgRQ1XBE-vfAz0NyXpotZsUtvE7fnif_hGv2nnCtBTs/edit?pli=1&tab=t.0#heading=h.fpdyt25cs4pu

  Note - we might be handling the context switching (whether the player is in offense or defense) within the blueprints.
  If that is the case, pass in position: 'none' to the constructor to get vanilla "Tap A", "Double Tap A", and "Hold A" events.
  Otherwise, we can change offense/defense positions by gameMessage.send({ position: "offense" }) and a listener will auto
  switch the button types in this class instance accordingly.
*/

import { TwoButtonHexagon } from '../2_Button/TwoButtonHexagon.js';

// One button is slightly more complex that two button (has a double tap listener)
export class OneButtonHexagon extends TwoButtonHexagon {
  constructor(config = {}) {
    const oneButtonConfig = {
      variant: 'singular',
      position: 'none', // 'none' | 'offense' | 'defense'
      ...config
    }
    super(oneButtonConfig);

    this.tapCount = 0;
    this.tapTimerRef = null;
    this.doubleTapThreshold = 200 // ms between taps (THIS ADDS LATENCY)
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _handleTap() {
    const { position } = this.config;

    if (position === 'offense') {
      console.log('Pass or Shoot depending on context');
    } else if (position === 'defense') {
      console.log('Tackle');
    } else {
      console.log('Tap A');
    }
  }

  _handleDoubleTap() {
    const { position } = this.config;
    if (position === 'defense') {
      console.log('Slide Tackle');
    } else {
      console.log('Double Tap A')
    }
  }

  _handleTouchHold(e) {
    const { position } = this.config;
    // track how long we were holding for in ms
    const duration = Date.now() - this.holdStartTime;
    // In the documentation it is mentioned that charge power will be determined by how
    // long the button was held - can send game messages about that here.
    if (position === 'offense') {
      console.log(`Kick charged for ${duration} ms`);
    } else if (position === 'defense') {
      console.log('Initiate Jockey');
    } else {
      console.log('Button hold detected (in ms): ', duration);
    }
  }

  _triggerTap() {
    if (this.isHolding) return;
    const { position } = this.config;
    this.tapCount++;

    this._clearTimer(this.tapTimerRef);

    // If we know we're in offense ahead of time,
    // We don't need to wait for double tap signal (no latency)
    if (position === 'offense') {
      this._handleTap();
      this.tapCount = 0;
    } else {
      // Wait for the duration for double tap to pass to decide
      // if button got a single or double tap (adds latency for single taps)
      this.tapTimerRef = setTimeout(() => {
        if (this.tapCount === 1) {
          this._handleTap();
        } else if (this.tapCount >= 2) {
          this._handleDoubleTap();
        }
        this.tapCount = 0;
      }, this.doubleTapThreshold);
    }
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
  destroy() {
    this._clearTimer(this.tapTimerRef);
    super.destory();
  }
}