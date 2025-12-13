import { input } from '../../sdk/index.js';
import { mapLabelToGamepadButton } from '../../utils/game-bridge.utils.js';
import { ZoneButton } from '../ZoneButton/ZoneButton.js';

/*
  Adds tap functionality to ZoneButton.
  Note - There is capability for hold functionality, but it is currently commented out.
*/
export class OneButtonZone extends ZoneButton {
    constructor(config = {}) {
    const oneButtonConfig = {
      variant: 'singular',
      ...config
    }
    super(oneButtonConfig);

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
    // Additional pointer up listener for tap and hold events inside button zone.
    this.svgPath.addEventListener('pointerup', this._handlePointerUpInsideZone.bind(this));
  }

  _handlePointerDown(e) {
    super._handlePointerDown(e);

    this.isPointerDown = true;
    // this.holdTimerRef = setTimeout(() => {
    //   if (this.isPointerDown) {
    //     this.isHolding = true;
    //     this.holdStartTime = Date.now() - this.holdThreshold;
    //   }
    // }, this.holdThreshold);
  }

  _handlePointerUpOutsideZone(e) {
    super._handlePointerUpOutsideZone();
    if (!this.isPointerDown) return;

    if (this.isHolding) {
      this._handleTouchHold(e);
    }

    this.isPointerDown = false;
    this.isHolding = false;
    // this._clearTimer(this.holdTimerRef);
  }

  _handlePointerUpInsideZone(e) {
    e.preventDefault();
    if (!this.isPointerDown) return;

    if (!this.isHolding) {
      this._triggerTap();
    }
  }

  _handleTap() {
    const { label } = this.config;
    const buttonType = mapLabelToGamepadButton(label);

    console.log(`Pressed ${label}`);
    input.setGamepadButton(buttonType, true);
  }

  _handleTouchHold() {
    const { label, variant } = this.config;
    const duration = Date.now() - this.holdStartTime;
    console.log(`${label} Button Held for ${duration} ms`);
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
  // destroy() {
  //   this._clearTimer(this.holdTimerRef);
  //   super.destory();
  // }

}