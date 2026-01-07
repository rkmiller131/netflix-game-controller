import { input, GamepadAxis } from '../../sdk/index.js';
import { mapLabelToGamepadButton } from '../../utils/game-bridge.utils.js';

/**
 * The custom Joystick component is heavily dependent on its surrounding HTML/CSS structure.
 * It requires a predefined container area (#joystick-area) and a placeholder SVG element
 * (#joystick-placeholder) to determine its size and position.
 * Anything rendered to the #footer (or anything above or below the .user-input-area)
 * must be done before instantiating this class to ensure proper size calculations.
*/
export class Joystick {
  constructor() {
    this.joystickContainer = null;
    this.placeholder = null;
    this.activeJoystick = null;
    this.thumbRestContainer = null;
    this.thumbRest = null;
    this.isDraggingJoystick = false;

    this._onPointerDown = null;
    this._onPointerUp = null;
    this._onPointerMove = null;

    this._setupReferences();
    this._bindEvents();
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _setupReferences() {
    const joystickContainer = document.getElementById('directional-input-area');
    if (!joystickContainer) {
      console.warn('No joystick area found. Add <div id="directional-input-area"></div> to your index.html');
      return;
    }

    this.joystickContainer = joystickContainer;
    this.placeholder = this._buildPlaceholderJoystick();
    this.activeJoystick = this._buildActiveJoystick();

    const thumbRestContainer = this.activeJoystick.querySelector('#thumb-rest-container');
    const thumbRest = this.activeJoystick.querySelector('#thumb-rest');

    if (!thumbRest || !thumbRestContainer) {
      console.error('No joystick thumb rest or thumb div found. _buildActiveJoystick() failed!');
      return;
    }

    this.thumbRestContainer = thumbRestContainer;
    this.thumbRest = thumbRest;

    // Position the active joystick at placeholder location on initialization
    this._positionJoystickAtPlaceholder();
  }

  _buildActiveJoystick() {
    if (!this.joystickContainer) {
      console.error('Need a pre-defined container bounds for the joystick. _setupReferences() failed.');
      return;
    }

    // Main joystick container
    const joystickElement = document.createElement('div');
    joystickElement.id = 'active-joystick';

    // SVG of the base joystick (pivot handle) - matches placeholder dimensions
    const pivot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pivot.setAttribute('width', '295');
    pivot.setAttribute('height', '289');
    pivot.setAttribute('viewBox', '0 0 295 289');
    pivot.setAttribute('fill', 'none');
    pivot.setAttribute('id', 'pivot');

    const pivotPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pivotPath.setAttribute('d', 'M147.339 2C227.569 2.00026 292.677 65.7621 292.677 144.5C292.677 223.238 227.569 287 147.339 287C67.1086 287 2 223.238 2 144.5C2 65.7619 67.1086 2 147.339 2Z');
    pivotPath.setAttribute('stroke', 'url(#pivotPathGradient)');
    pivotPath.setAttribute('stroke-width', '4');

    pivot.appendChild(pivotPath);

    // Separate thumb rest div that can move freely outside of the pivot view box
    const thumbRestContainer = document.createElement('div');
    thumbRestContainer.id = 'thumb-rest-container';

    const thumbRest = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    thumbRest.setAttribute('viewBox', '0 0 295 289'); // Match placeholder coordinate space
    thumbRest.setAttribute('fill', 'none');
    thumbRest.style.transformOrigin = '147.338px 144.5px'; // Center point of placeholder
    thumbRest.setAttribute('id', 'thumb-rest');

    const thumbPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    thumbPath.setAttribute('d', 'M146.531 74C186.551 74 219.063 105.811 219.063 145.135C219.063 184.459 186.551 216.27 146.531 216.27C106.511 216.269 74 184.459 74 145.135C74.0001 105.811 106.511 74.0002 146.531 74Z');
    thumbPath.setAttribute('fill', '#ACA9BE');
    thumbPath.setAttribute('stroke', 'url(#pivotPathGradient)');
    thumbPath.setAttribute('stroke-width', '5');

    const innerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    innerGroup.setAttribute('filter', 'url(#filter1_i_235_19)');

    const innerEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    innerEllipse.setAttribute('cx', '146.534');
    innerEllipse.setAttribute('cy', '145.135');
    innerEllipse.setAttribute('rx', '61.4307');
    innerEllipse.setAttribute('ry', '60.2143');
    innerEllipse.setAttribute('fill', '#BEBAD5');

    innerGroup.appendChild(innerEllipse);
    thumbRest.appendChild(thumbPath);
    thumbRest.appendChild(innerGroup);
    thumbRestContainer.appendChild(thumbRest);

    // Filters and effects
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = joystickDefs;
    pivot.appendChild(defs);

    // Assemble the elements!
    joystickElement.appendChild(pivot);
    joystickElement.appendChild(thumbRestContainer);
    this.joystickContainer.appendChild(joystickElement);

    return joystickElement;
  }

  _buildPlaceholderJoystick() {
    if (!this.joystickContainer) {
      console.error('Need a pre-defined container bounds for the joystick. _setupReferences() failed.');
      return;
    }

    // Main placeholder container
    const placeholderElement = document.createElement('div');
    placeholderElement.id = 'joystick-placeholder';

    // SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '295');
    svg.setAttribute('height', '289');
    svg.setAttribute('viewBox', '0 0 295 289');
    svg.setAttribute('fill', 'none');

    // Outer circle path
    const outerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outerPath.setAttribute('d', 'M147.339 2C227.569 2.00026 292.677 65.7621 292.677 144.5C292.677 223.238 227.569 287 147.339 287C67.1086 287 2 223.238 2 144.5C2 65.7619 67.1086 2 147.339 2Z');
    outerPath.setAttribute('stroke', 'url(#paint0_linear_260_17)');
    outerPath.setAttribute('stroke-width', '4');

    // Opacity group for the thumb rest
    const opacityGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    opacityGroup.setAttribute('opacity', '0.3');

    // Thumb rest path
    const thumbPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    thumbPath.setAttribute('d', 'M146.531 74C186.551 74 219.063 105.811 219.063 145.135C219.063 184.459 186.551 216.27 146.531 216.27C106.511 216.269 74 184.459 74 145.135C74.0001 105.811 106.511 74.0002 146.531 74Z');
    thumbPath.setAttribute('fill', '#ACA9BE');
    thumbPath.setAttribute('stroke', '#151220');
    thumbPath.setAttribute('stroke-width', '4');

    // Inner filter group
    const filterGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    filterGroup.setAttribute('filter', 'url(#filter0_i_235_19)');

    // Inner ellipse
    const innerEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    innerEllipse.setAttribute('cx', '146.534');
    innerEllipse.setAttribute('cy', '145.135');
    innerEllipse.setAttribute('rx', '61.4307');
    innerEllipse.setAttribute('ry', '60.2143');
    innerEllipse.setAttribute('fill', '#BEBAD5');

    // Defs for filters and gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = placeholderJoystickDefs;

    // Assemble the SVG structure
    filterGroup.appendChild(innerEllipse);
    opacityGroup.appendChild(thumbPath);
    opacityGroup.appendChild(filterGroup);

    svg.appendChild(outerPath);
    svg.appendChild(opacityGroup);
    svg.appendChild(defs);

    placeholderElement.appendChild(svg);
    this.joystickContainer.appendChild(placeholderElement);

    return placeholderElement;
  }

  _bindEvents() {
    if (!this.joystickContainer) return;

    this._onPointerDown = this._handlePointerDown.bind(this);
    this._onPointerUp = this._handlePointerUp.bind(this);
    this._onPointerMove = this._handlePointerMove.bind(this);

    this.joystickContainer.addEventListener('pointerdown', this._onPointerDown);
    this.joystickContainer.addEventListener('pointerup', this._onPointerUp);
    this.joystickContainer.addEventListener('pointermove', this._onPointerMove);
    // handle pointer cancel events as a pointer up (finish the dragging)?
  }

  // ----------------------------------------------------------------------------
  // Repositions Joystick based on touch location -------------------------------
  // ----------------------------------------------------------------------------
  // (See _handlePointerDown for usage)
  _setJoystickCoordinates(clientX, clientY) {
    const parentRect = this.joystickContainer.getBoundingClientRect();

    // Match the active joystick's size to the placeholder size
    const placeholderSVG = this.placeholder.querySelector('svg');
    const placeholderRect = placeholderSVG.getBoundingClientRect();
    this.activeJoystick.style.width = `${placeholderRect.width}px`;
    this.activeJoystick.style.height = `${placeholderRect.height}px`;

    // Convert from pointer coordinates to parent coordinates
    let x = clientX - parentRect.left;
    let y = clientY - parentRect.top;

    // Center the joystick at the touched coordinates
    x = x - placeholderRect.width / 2;
    y = y - placeholderRect.height / 2;

    // Clamp within the parent container bounds (so it doesn't bleed past)
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + placeholderRect.width > parentRect.width) {
      x = parentRect.width - placeholderRect.width;
    }
    if (y + placeholderRect.height > parentRect.height) {
      y = parentRect.height - placeholderRect.height;
    }

    this.activeJoystick.style.left = `${x}px`;
    this.activeJoystick.style.top = `${y}px`;
  }

  // -------------------------------------------------------------------------
  // Joystick that doesn't move ----------------------------------------------
  // -------------------------------------------------------------------------
  _positionJoystickAtPlaceholder() {
    // Match the active joystick's size and position to the placeholder
    const placeholderSVG = this.placeholder.querySelector('svg');
    const placeholderRect = placeholderSVG.getBoundingClientRect();
    const parentRect = this.joystickContainer.getBoundingClientRect();

    // Set size to match placeholder
    this.activeJoystick.style.width = `${placeholderRect.width}px`;
    this.activeJoystick.style.height = `${placeholderRect.height}px`;

    // Position at placeholder location (relative to parent)
    const x = placeholderRect.left - parentRect.left;
    const y = placeholderRect.top - parentRect.top;

    this.activeJoystick.style.left = `${x}px`;
    this.activeJoystick.style.top = `${y}px`;
  }

  _calculateAngle(centerX, centerY, pointX, pointY) {
    // get deltas to simulate 0,0 as center of joystick
    const deltaX = pointX - centerX;
    const deltaY = pointY - centerY;
    // atan2 returns angle in radians; need to convert to degrees and
    // add additional 90 deg as the polar coordinate system's 0 deg angle is to the left
    // of our center, but the CSS's rotation from 0 deg starts from top of the center.
    const angleInRadians = Math.atan2(deltaY, deltaX);
    let angleInDegrees = (angleInRadians * 180) / Math.PI + 90;
    if (angleInDegrees < 0) angleInDegrees += 360;
    /*
      Now we have this coordinate system:
             0
             |
       270 ----- 90
             |
            180
    */
    return angleInDegrees;
  }

  _calculateThumbstickAngleAndDistance(clientX, clientY) {
    // Calculate the distance between the touch point and center, and restrict
    // the distance between the thumbstick and the center so that it doesn't go past
    // the bounds of the joystick
    const { x, y, width, height } = this.activeJoystick.getBoundingClientRect();

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    let distance = Math.sqrt(
      Math.pow(clientX - centerX, 2) +
      Math.pow(clientY - centerY, 2)
    );

    // Get the maximum radius as a percentage of the joystick size
    const maxRadius = Math.min(width, height) / 2;

    // Clamp distance to the maximum radius (this is in pixels)
    distance = Math.max(0, Math.min(distance, maxRadius));

    // Convert distance to percentage of the joystick size
    const distancePercentage = (distance / maxRadius) * 100;

    return {
      angle: this._calculateAngle(centerX, centerY, clientX, clientY),
      distancePercentage: distancePercentage
    };
  }

  _sendAxisInput(angle, distancePercentage) {
    // Convert angle and distance to X/Y coordinates
    const normalizedDistance = distancePercentage / 100; // 0 to 1

    // Convert angle to radians
    const angleRad = (angle - 90) * Math.PI / 180; // Subtract 90 to match standard coordinate system

    // Calculate X and Y values (-1 to 1 range)
    const axisX = Math.cos(angleRad) * normalizedDistance;
    const axisY = Math.sin(angleRad) * normalizedDistance;

    // Send axis tilt to Netflix
    input.setGamepadAxis(GamepadAxis.X, axisX);
    input.setGamepadAxis(GamepadAxis.Y, axisY);

  }

  // Responsible for spawning/de-spawning the active joystick base
  _handlePointerDown(e) {
    this.isDraggingJoystick = true;

    // COMMENT THIS BACK IN TO ENABLE MOVING JOYSTICK
    // Place the joystick wherever was touched within the bounds of #joystick-container
    // this._setJoystickCoordinates(e.clientX, e.clientY);

    // Calculate initial input based on touch position
    const { angle, distancePercentage } = this._calculateThumbstickAngleAndDistance(
      e.clientX,
      e.clientY
    );

    // Apply initial thumb position
    const maxMovementPercentage = 40;
    const scaledDistance = (distancePercentage / 100) * maxMovementPercentage;

    this.thumbRestContainer.style.transform = `rotate(${angle}deg)`;
    this.thumbRest.style.transform = `translateY(-${scaledDistance}%)`;
    this._sendAxisInput(angle, distancePercentage);

    this.placeholder.style.visibility = 'hidden';
    this.activeJoystick.style.visibility = 'visible';
  }

  _handlePointerUp(e) {
    this.isDraggingJoystick = false;
    // reset the thumb rest to center of the joystick pivot.
    this.thumbRest.style.transform = '';
    this.thumbRestContainer.style.transform = '';

    this.placeholder.style.visibility = 'visible';
    this.activeJoystick.style.visibility = 'hidden';

    // Reset axis input
    input.setGamepadAxis(GamepadAxis.X, 0);
    input.setGamepadAxis(GamepadAxis.Y, 0);
  }

  _handlePointerMove(e) {
    if (!this.isDraggingJoystick) {
      this.thumbRest.style.transform = '';
      this.thumbRestContainer.style.transform = '';
    } else {
      // Move the thumb rest of the joystick around its pivot
      const { angle, distancePercentage } = this._calculateThumbstickAngleAndDistance(
        e.clientX,
        e.clientY
      );

      // Apply transforms (distance thumb rest moves from pivot)
      // based on a percentage of joystick size (e.g. max 40%)
      const maxMovementPercentage = 40;
      const scaledDistance = (distancePercentage / 100) * maxMovementPercentage;

      this.thumbRestContainer.style.transform = `rotate(${angle}deg)`;
      this.thumbRest.style.transform = `translateY(-${scaledDistance}%)`;
      this._sendAxisInput(angle, distancePercentage);
    }
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
 destroy() {
  // Prevent sticking if destoyed mid-drag or mid-input
  input.setGamepadAxis(GamepadAxis.X, 0);
  input.setGamepadAxis(GamepadAxis.Y, 0);

  // Remove pointer event listeners
  if (this.joystickContainer) {
    if (this._onPointerDown) {
      this.joystickContainer.removeEventListener('pointerdown', this._onPointerDown);
    }
    if (this._onPointerUp) {
      this.joystickContainer.removeEventListener('pointerup', this._onPointerUp);
    }
    if (this._onPointerMove) {
      this.joystickContainer.removeEventListener('pointermove', this._onPointerMove);
    }
  }

  // Remove the DOM elements
  if (this.placeholder) {
    this.placeholder.remove();
  }
  if (this.activeJoystick) {
    this.activeJoystick.remove();
  }

  // Clear references
  this.joystickContainer = null;
  this.placeholder = null;
  this.activeJoystick = null;
  this.thumbRestContainer = null;
  this.thumbRest = null;

  this._onPointerDown = null;
  this._onPointerUp = null;
  this._onPointerMove = null;

  this.isDraggingJoystick = false;
 }

}

// Defs are reusable effects on an svg like filters, drop shadows, patterns, etc.
const joystickDefs = `
  <filter id="filter0_d_235_19" x="0" y="0" width="295" height="289" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.839216 0 0 0 0 0.145098 0 0 0 0 0.211765 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_235_19"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_235_19" result="shape"/>
  </filter>
  <filter id="filter1_i_235_19" x="85.1035" y="84.9209" width="122.861" height="124.429" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_235_19"/>
  </filter>
  <linearGradient id="pivotPathGradient" x1="179" y1="0" x2="179" y2="358" gradientUnits="userSpaceOnUse">
    <stop stop-color="#6A202B"/>
    <stop offset="0.264423" stop-color="#561C3B"/>
    <stop offset="0.692308" stop-color="#401644"/>
    <stop offset="1" stop-color="#3A1551"/>
  </linearGradient>
`;

const placeholderJoystickDefs = `
  <filter id="filter0_i_235_19" x="85.1035" y="84.9209" width="122.861" height="124.429" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_235_19"/>
  </filter>
  <linearGradient id="paint0_linear_260_17" x1="179" y1="0" x2="179" y2="358" gradientUnits="userSpaceOnUse">
    <stop stop-color="#6A202B"/>
    <stop offset="0.264423" stop-color="#561C3B"/>
    <stop offset="0.692308" stop-color="#401644"/>
    <stop offset="1" stop-color="#3A1551"/>
  </linearGradient>
`;