/*
  This button is based off of the first proposal for a custom layout - swipe and gesture support for beginner and advanced layouts.
  See this documentation: https://docs.google.com/presentation/d/1SN0TlLuQmr9M986PLiCfaNrwow2HI3vUQs4ykmenO7Y/edit?slide=id.g34aec231b9b_2_0#slide=id.g34aec231b9b_2_0
  If we go with swipe buttons, we need to modify the html to include a gesture canvas. See index.gestures.html
*/

import { BeginnerSwipeHexagonButton } from '../2_Button/BeginnerSwipeHexagonButton.js';

/**
 * A configurable Hexagon button designed for 3-button advanced layouts.
 * Method overrides to add additional swiping logic.
 * NOTE - @TODO - X button gesture is still undefined
*/
export class AdvancedSwipeHexagonButton extends BeginnerSwipeHexagonButton {
  constructor(config = {}) {
    super(config);
  }

  _handleTap() {
    switch(this.config.position) {
      case 'offense':
        if (this.config.variant === 'primary') {
          console.log('Shoot!');
        } else if (this.config.variant === 'secondary') {
          console.log('Pass');
        }
        // X doesn't have a tap in offense mode
        break;
      case 'defense':
        if (this.config.variant === 'primary') {
          console.log('Light Tackle');
        } else if (this.config.variant === 'tertiary') {
          console.log('Call Second Defender');
        }
        // B doesn't have a tap in defense mode
        break;
      default:
        console.log(`Tap ${this.config.label}`);
    }
  }

  _handleTouchHold(e) {
    // start tracking for gesture/swipes
    const state = this.gestureState;
    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Gesture detected
    if (distance > state.swipeThreshold) {
      state.isGesturing = true;
      this._triggerGesture(deltaX, deltaY);
    }
  }

  _triggerTap() {
    // Buttons in advanced layout rely on swipes and single taps
    // logic for detecting tap vs double tap removed
    const state = this.gestureState;
    if (state.isGesturing) return;

    this._handleTap();
  }

  _triggerSwipeLeft() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'primary' && position === 'offense') {
      console.log('Left curve shot');
    }

    if (variant === 'secondary') {
      if (position === 'offense') {
        console.log('Lead pass');
      } else {
        console.log('Swap player left');
      }
    }
  }

  _triggerSwipeRight() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'primary' && position === 'offense') {
      console.log('Right curve shot');
    }

    if (variant === 'secondary') {
      if (position === 'offense') {
        console.log('Lead lob');
      } else {
        console.log('Swap player right');
      }
    }
  }

  _triggerSwipeUp() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'primary' && position === 'offense') {
      console.log('Chip shot');
    }

    if (variant === 'secondary') {
      if (position === 'offense') {
        console.log('Cross');
      } else {
        console.log('Swap player front');
      }
    }
  }

  _triggerSwipeDown() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (position === 'defense') {
      if (variant === 'primary') {
        console.log('Slide Tackle');
      } else if (variant === 'secondary') {
        console.log('Swap player behind');
      }
    }
  }
}