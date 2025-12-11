/*
This button is based off of the first proposal for a custom layout - swipe and gesture support for beginner and advanced layouts.
See this documentation: https://docs.google.com/presentation/d/1SN0TlLuQmr9M986PLiCfaNrwow2HI3vUQs4ykmenO7Y/edit?slide=id.g34aec231b9b_2_0#slide=id.g34aec231b9b_2_0
If we go with swipe buttons, we need to modify the html to include a gesture canvas. See index.gestures.html
*/

import { HexagonButton } from '../HexagonButton/HexagonButton.js';

/**
 * A configurable Hexagon button designed for 2-button beginner layouts.
 * Additional configuration for offensive and defensive player states
 * change button responses. Includes gesture visualization with trailing lines.
*/
export class BeginnerSwipeHexagonButton extends HexagonButton {
  constructor(config = {}) {
    const beginnerConfig = {
      position: 'offense', // 'offense', 'defense', or 'menu'
      ...config
    }
    super(beginnerConfig);

    this.gestureState = {
      isPointerDown: false,
      isGesturing: false,
      startTime: 0,
      startX: 0,
      startY: 0,
      tapCount: 0,
      tapTimer: null, // to track time between taps
      holdTimer: null, // to track beginning of gestures
      holdThreshold: 100, // ms for hold detection
      doubleTapThreshold: 180, // ms between taps
      swipeThreshold: 50 // pixels for swipe detection
    }

    if (this.config.position !== 'menu') {
      this.gestureCanvas = null;
      this.gestureCtx = null;
      this.gestureTrail = [];
      this.maxTrailLength = 15;
      this.isTrailActive = false;

      this._setupGestureVisualization();
    }
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _bindEvents() {
    super._bindEvents();
    // Additional pointer up listener for tap/double tap events inside button zone
    this.svgPath.addEventListener('pointerup', this._handlePointerUpInsideZone.bind(this));
    // Listener for drawing gesture trails
    if (this.config.position !== 'menu') {
      const buttonContainer = document.getElementById('button-container');
      if (buttonContainer) {
        buttonContainer.addEventListener('pointermove', this._handlePointerMove.bind(this));
        buttonContainer.addEventListener('mouseleave', this._handlePointerUpOutsideZone.bind(this));
      }
      // Netflix specific listener
      this.svgPath.addEventListener('touchmove', this._handlePointerMove.bind(this), { passive: false });
    }
  }

  _setupGestureVisualization() {
    this.gestureCanvas = document.getElementById('gesture-canvas');

    if (!this.gestureCanvas) {
      console.warn('Gesture canvas not found! Add <canvas id="gesture-canvas" class="gesture-overlay"></canvas> as a child of button-container');
      return;
    }

    this.gestureCtx = this.gestureCanvas.getContext('2d');

    // Set up canvas size only once, when first button initializes
    if (!this.gestureCanvas.dataset.initialized) {
      this._resizeCanvas();
      this.gestureCanvas.dataset.initialized = 'true';
    }
  }

  _resizeCanvas() {
    if (!this.gestureCanvas) return;

    const buttonContainer = this.gestureCanvas.parentNode;
    const rect = buttonContainer.getBoundingClientRect();

    // Actual canvas size (accounting for device pixel ratio)
    const dpr = window.devicePixelRatio || 1;
    this.gestureCanvas.width = rect.width * dpr;
    this.gestureCanvas.height = rect.height * dpr;

    // Display size
    this.gestureCanvas.style.width = rect.width + 'px';
    this.gestureCanvas.style.height = rect.height + 'px';

    // Scale context for high DPI
    this.gestureCtx.scale(dpr, dpr);
  }

  _addTrailPoint(clientX, clientY) {
    if (!this.gestureCtx) return;

    // Get container bounds for relative positioning
    const containerRect = this.gestureCanvas.parentNode.getBoundingClientRect();
    const relativeX = clientX - containerRect.left;
    const relativeY = clientY - containerRect.top;

    // Add new point to trail
    this.gestureTrail.push({
      x: relativeX,
      y: relativeY,
      timestamp: Date.now(),
      opacity: 1.0
    });

    // Limit trail length
    if (this.gestureTrail.length > this.maxTrailLength) {
      this.gestureTrail.shift();
    }

    // Update trail opacity based on age
    const currentTime = Date.now();
    this.gestureTrail.forEach((point) => {
      const age = currentTime - point.timestamp;
      const maxAge = 200; // trail life/length
      point.opacity = Math.max(0, 1 - (age / maxAge));
    });

    // Remove fully faded points
    this.gestureTrail = this.gestureTrail.filter(point => point.opacity > 0);

    // Clear canvas and redraw trail
    this._drawGestureTrail();
  }

  _drawGestureTrail() {
    if (!this.gestureCtx || this.gestureTrail.length < 2) return;

    // Clear canvas
    this.gestureCtx.clearRect(0, 0, this.gestureCanvas.width, this.gestureCanvas.height);

    // Draw trail as connected segments
    for (let i = 1; i < this.gestureTrail.length; i++) {
      const prevPoint = this.gestureTrail[i - 1];
      const currentPoint = this.gestureTrail[i];

      // Set line style - soft white
      this.gestureCtx.beginPath();
      this.gestureCtx.moveTo(prevPoint.x, prevPoint.y);
      this.gestureCtx.lineTo(currentPoint.x, currentPoint.y);
      this.gestureCtx.strokeStyle = `rgba(255, 255, 255, ${currentPoint.opacity})`;
      this.gestureCtx.lineWidth = 10;
      this.gestureCtx.lineCap = 'round';
      this.gestureCtx.lineJoin = 'round';
      this.gestureCtx.stroke();
    }
  }

  _handlePointerMove(e) {
    if (!this.gestureState.isPointerDown) return;

    // Only show trail if we're in gesture mode (after hold threshold)
    if (this.isTrailActive) {
      this._addTrailPoint(e.clientX, e.clientY);
    }
  }

  _handlePointerDown(e) {
    super._handlePointerDown(e);

    const state = this.gestureState;
    state.isPointerDown = true;
    state.startTime = Date.now();
    state.startX = e.clientX;
    state.startY = e.clientY;

    if (this.config.position !== 'menu') {
      this.gestureTrail = [];
      this.isTrailActive = false;
    }

    state.holdTimer = setTimeout(() => {
      if (state.isPointerDown) {
        state.isGesturing = true;
        this.isTrailActive = true;
        this._addTrailPoint(e.clientX, e.clientY);
      }
    }, state.holdThreshold);
  }

  _handlePointerUpOutsideZone(e) {
    super._handlePointerUpOutsideZone();
    const state = this.gestureState;
    if (!state.isPointerDown) return;

    if (state.isGesturing) {
      this._handleTouchHold(e);
    }

    state.isPointerDown = false;
    state.isGesturing = false;
    this.isTrailActive = false;
    this._clearTimer(state.holdTimer);
    this._clearGestureTrail();
  }

  _handlePointerUpInsideZone(e) {
    e.preventDefault();
    const state = this.gestureState;
    if (!state.isPointerDown || state.isGesturing) return;

    const duration = Date.now() - state.startTime;
    if (duration < state.holdThreshold) {
        this._triggerTap();
    }
  }

  _handleTap() {
    switch(this.config.position) {
      case 'offense':
        if (this.config.variant === 'primary') {
          console.log('Shoot!');
        } else {
          console.log('Pass');
        }
        break;
      case 'defense':
        if (this.config.variant === 'primary') {
          console.log('Light Tackle');
        } else {
          console.log('Swap players');
        }
        break;
      default:
        console.log(`Tap ${this.config.label}`);
    }
  }

  _handleDoubleTap() {
    const { variant, position } = this.config;

    if (variant === 'primary' && position === 'defense') {
      console.log('Slide Tackle');
    }

    if (variant === 'secondary' && position === 'offense') {
      console.log('Cross');
    }
  }

  _handleTouchHold(e) {
    const { variant, position } = this.config;
    // In beginner layout, the A button in offense has no gestures
    if (
      (variant === 'primary' && position === 'offense')
      || position === 'menu'
    ) return;

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

  _clearTimer(timerRef) {
    if (this.gestureState[timerRef]) {
      clearTimeout(this.gestureState[timerRef]);
      this.gestureState[timerRef] = null;
    }
  }

  _clearGestureTrail() {
    this.gestureTrail = [];
    this.isTrailActive = false;
    if (this.gestureCtx) {
      this.gestureCtx.clearRect(0, 0, this.gestureCanvas.width, this.gestureCanvas.height);
    }
  }

  _triggerGesture(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const horizontalDirection = absX > absY;
    const straightHorizontal = deltaY < 40 && deltaY > -40;
    const straightVertical = deltaX < 40 && deltaX > -40;

    if (horizontalDirection) {
      if (deltaX > 0 && straightHorizontal) {
        this._triggerSwipeRight();
      } else if (deltaX < 0 && straightHorizontal) {
        this._triggerSwipeLeft();
      }
    } else {
      if (deltaY > 0 && straightVertical) {
        this._triggerSwipeDown();
      } else if (deltaY < 0 && straightVertical) {
        this._triggerSwipeUp();
      }
    }
  }

  _triggerTap() {
    const state = this.gestureState;
    if (state.isGesturing) return;
    const { variant, position } = this.config;
    state.tapCount++;

    this._clearTimer(state.tapTimer);

    // These buttons/modes need instant tap (no latency)
    // And don't need to wait for a double tap signal
    if (
      position === 'menu'
      || (variant === 'primary' && position === 'offense')
      || (variant === 'secondary' && position === 'defense')
    ) {
      this._handleTap();
      state.tapCount = 0;
    } else {
      // Wait for the duration for double tap to pass to decide
      // if button got a single or double tap (adds latency for single taps)
      state.tapTimer = setTimeout(() => {
        if (state.tapCount === 1) {
            this._handleTap();
        } else if (state.tapCount >= 2) {
            this._handleDoubleTap();
        }
        state.tapCount = 0;
      }, state.doubleTapThreshold);
    }
  }

  _triggerSwipeLeft() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'secondary' && position === 'defense') {
      console.log('Swap player left');
    }
  }

  _triggerSwipeRight() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'secondary' && position === 'defense') {
      console.log('Swap player right');
    }
  }

  _triggerSwipeUp() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'secondary' && position === 'defense') {
      console.log('Swap player front');
    }
    if (variant === 'secondary' && position === 'offense') {
      console.log('Cross');
    }
  }

  _triggerSwipeDown() {
    const { variant, position } = this.config;
    if (position === 'menu') return;

    if (variant === 'secondary' && position === 'defense') {
      console.log('Swap player behind');
    }
    if (variant === 'primary' && position === 'defense') {
      console.log('Slide Tackle')
    }
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
  destroy() {
    this._clearTimer(this.gestureState.tapTimer);
    this._clearTimer(this.gestureState.holdTimer);
    this._clearGestureTrail();
    super.destory();
  }

  // Changes from 'offense' to 'defense' should call this function
  setPosition(newPosition) {
    this.config.position = newPosition;
  }
}