/*
  This button is based off of the second proposal for a custom layout - tap and hold inputs (no double tap).
  See the following documentation:
  https://drive.google.com/file/d/19NSoiJLbKUWFJhvwTnzL_OE246Z2EeoJ/view
  https://docs.google.com/document/d/1fgRQ1XBE-vfAz0NyXpotZsUtvE7fnif_hGv2nnCtBTs/edit?pli=1&tab=t.0#heading=h.fpdyt25cs4pu

  Note - we might be handling the context switching (whether the player is in offense or defense) within the blueprints.
  If that is the case, pass in position: 'none' to the constructor to get vanilla "Tap A" and "Hold A" events.
  Otherwise, we can change offense/defense positions by gameMessage.send({ position: "offense" }) and a listener will auto
  switch the button types in this class instance accordingly.
*/

import { HexagonButton } from '../HexagonButton/HexagonButton.js';

export class TwoButtonHexagon extends HexagonButton {
    constructor(config = {}) {
    const twoButtonConfig = {
      variant: 'primary',
      position: 'none', // 'none' | 'offense' | 'defense'
      ...config
    }
    super(twoButtonConfig);

    this.holdStartTime = 0;
    this.holdTimerRef = null;
    this.holdThreshold = 350 // ms for hold detection
    this.isPointerDown = false;
    this.isHolding = false;
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _bindEvents() {
    super._bindEvents();
    // Additional pointer up listener for tap/double tap and hold events inside button zone.
    this.svgPath.addEventListener('pointerup', this._handlePointerUpInsideZone.bind(this));
  }

  _handlePointerDown(e) {
    super._handlePointerDown(e);

    this.isPointerDown = true;
    this.holdTimerRef = setTimeout(() => {
      if (this.isPointerDown) {
        this.isHolding = true;
        this.holdStartTime = Date.now() - this.holdThreshold;
      }
    }, this.holdThreshold);
  }

  _handlePointerUpOutsideZone(e) {
    super._handlePointerUpOutsideZone();
    if (!this.isPointerDown) return;

    if (this.isHolding) {
      this._handleTouchHold(e);
    }

    this.isPointerDown = false;
    this.isHolding = false;
    this._clearTimer(this.holdTimerRef);
  }

  _handlePointerUpInsideZone(e) {
    e.preventDefault();
    if (!this.isPointerDown) return;

    if (!this.isHolding) {
      this._triggerTap();
    }
  }

  _handleTap() {
    const { variant, position } = this.config;

    if (variant === 'primary') {
      if (position === 'offense') {
        console.log('Pass: Type of kick is determined with input interpretation');
      } else if (position === 'defense') {
        console.log('Slide Tackle');
      } else {
        console.log('Tap A');
      }

    } else if (variant === 'secondary') {
      if (position === 'offense') {
        console.log('Shoot: Type of kick is determined with input interpretation');
      } else if (position === 'defense') {
        console.log('Light Tackle');
      } else {
        console.log('Tap B');
      }
    }
  }

  _handleTouchHold() {
    const { label, variant, position } = this.config;
    const duration = Date.now() - this.holdStartTime;

    if (variant === 'primary' && position === 'defense') {
      console.log('Initiate Jockey');
    } else {
      console.log(`${label} Button Held for ${duration} ms`);
    }
  }

  _triggerTap() {
    if (this.isHolding) return;
    this._handleTap();
  }

  _clearTimer(timerRef) {
    if (this[timerRef]) {
      clearTimeout(this[timerRef]);
      this[timerRef] = null;
    }
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
  destroy() {
    this._clearTimer(this.holdTimerRef);
    super.destroy();
  }

  // Changes from 'offense' to 'defense' should call this function
  setPosition(newPosition) {
    this.config.position = newPosition;
  }

}