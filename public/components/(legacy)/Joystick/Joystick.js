import { input, GamepadAxis } from '../../sdk/index.js';

export class Joystick {
  constructor() {
    this.joystickContainer = null;
    this.placeholder = null;
    this.activeJoystick = null;
    this.thumbRestContainer = null;
    this.thumbRest = null;
    this.isDraggingJoystick = false;

    this._setupReferences();
    this._bindEvents();
  }

  _setupReferences() {
    const joystickContainer = document.getElementById('joystick-container');
    if (!joystickContainer) {
      console.warn('No joystick container found. Add <div id="joystick-container"></div> to your index.html');
      return;
    }

    const joyStickPlaceholder = document.getElementById('joystick-placeholder');
    if (!joyStickPlaceholder) {
      console.warn('No joystick placeholder found. Add <div id="joystick-placeholder"><Your_SVG_Element /></div> to index.html');
      return;
    }

    this.joystickContainer = joystickContainer;
    this.placeholder = joyStickPlaceholder;
    this.activeJoystick = this._buildActiveJoystick();

    const thumbRestContainer = this.activeJoystick.querySelector('#thumb-rest-container');
    const thumbRest = this.activeJoystick.querySelector('#thumb-rest');

    if (!thumbRest || !thumbRestContainer) {
      console.error('No joystick thumb rest or thumb div found. _buildActiveJoystick() failed!');
      return;
    }

    this.thumbRestContainer = thumbRestContainer;
    this.thumbRest = thumbRest;
  }

  _buildActiveJoystick() {
    if (!this.joystickContainer) {
      console.error('Need a pre-defined container bounds for the joystick. _setupReferences() failed.');
      return;
    }

    // Main joystick container
    const joystickElement = document.createElement('div');
    joystickElement.id = 'active-joystick';

    // SVG of the base joystick (pivot handle)
    const pivot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pivot.setAttribute('width', '317');
    pivot.setAttribute('height', '311');
    pivot.setAttribute('viewBox', '0 0 317 311');
    pivot.setAttribute('fill', 'url(#pivotGradient)');
    pivot.setAttribute('id', 'pivot');

    const pivotPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pivotPath.setAttribute('d', 'M158.339 12.5C238.836 12.5003 304.177 76.4765 304.177 155.5C304.177 234.523 238.836 298.5 158.339 298.5C77.8419 298.5 12.5 234.524 12.5 155.5C12.5 76.4764 77.8419 12.5 158.339 12.5Z');
    pivotPath.setAttribute('stroke', '#D62536');
    pivotPath.setAttribute('stroke-width', '5');

    pivot.appendChild(pivotPath);

    // Separate thumb rest div that can move freely outside of the pivot view box
    const thumbRestContainer = document.createElement('div');
    thumbRestContainer.id = 'thumb-rest-container';

    const thumbRest = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    thumbRest.setAttribute('viewBox', '0 0 317 311'); // Thumb coordinates are defined in same coordinate space as pivot
    thumbRest.setAttribute('fill', 'none');
    thumbRest.style.transformOrigin = '158.338px 155.5px';
    thumbRest.setAttribute('id', 'thumb-rest');

    const thumbPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    thumbPath.setAttribute('d', 'M157.531 85C197.551 85 230.063 116.811 230.063 156.135C230.063 195.459 197.551 227.27 157.531 227.27C117.511 227.269 85 195.459 85 156.135C85.0001 116.811 117.511 85.0002 157.531 85Z');
    thumbPath.setAttribute('fill', '#ACA9BE');
    thumbPath.setAttribute('stroke', '#D62536');
    thumbPath.setAttribute('stroke-width', '4');

    const innerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    innerGroup.setAttribute('filter', 'url(#filter1_i_235_19)');

    const innerEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    innerEllipse.setAttribute('cx', '157.534');
    innerEllipse.setAttribute('cy', '156.135');
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

  _bindEvents() {
    const joystickContainer = document.getElementById('joystick-container');
    if (joystickContainer) {
      //                                  touchstart?
      joystickContainer.addEventListener('pointerdown', this._handlePointerDown.bind(this));
      joystickContainer.addEventListener('pointerup', this._handlePointerUp.bind(this));
      joystickContainer.addEventListener('pointermove', this._handlePointerMove.bind(this));
      // handle pointer cancel events as a pointer up (finish the dragging)?
    }
  }

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

    // Send to Netflix SDK
    input.setGamepadAxis(GamepadAxis.X, axisX);
    input.setGamepadAxis(GamepadAxis.Y, axisY);
  }

  // Responsible for spawning/de-spawning the active joystick base
  _handlePointerDown(e) {
    // console.log('e is ', e);
    this.isDraggingJoystick = true;
    this.placeholder.style.visibility = 'hidden';

    // Place the joystick wherever was touched within the bounds of #joystick-container
    this._setJoystickCoordinates(e.clientX, e.clientY);
    this.activeJoystick.classList.add('joystick--visible');
  }

  _handlePointerUp(e) {
    this.isDraggingJoystick = false;
    // reset the thumb rest to center of the joystick pivot.
    this.thumbRest.style.transform = '';
    this.thumbRestContainer.style.transform = '';

    this.placeholder.style.visibility = 'visible';
    this.activeJoystick.classList.remove('joystick--visible');
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
}

// Defs are reusable effects on an svg like filters, drop shadows, patterns, etc.
const joystickDefs = `
  <filter id="filter0_d_235_19" x="0" y="0" width="316.677" height="311" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.839216 0 0 0 0 0.145098 0 0 0 0 0.211765 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_235_19"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_235_19" result="shape"/>
  </filter>
  <filter id="filter1_i_235_19" x="96.1035" y="95.9209" width="122.861" height="124.429" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_235_19"/>
  </filter>
  <radialGradient id="pivotGradient" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#16161dff" />
    <stop offset="40%" stop-color="#20202bff" />
    <stop offset="100%" stop-color="#33303F" />
  </radialGradient>
`;