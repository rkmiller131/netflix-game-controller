/**
 * A configurable zone button with color changing tap states - default is a circular shape.
*/
export class ZoneButton {
  constructor(config = {}) {
    // Default configuration if none passed to constructor
    this.config = {
        label: 'A',
        variant: 'singular', // bottom, right, top, left, singular
        ...config
    };

    this.element = null;
    this.svgPath = null;
    this.svgLabel = null;
    this.isActive = false;

    this._render();
    this._bindEvents();
  }

  /**
   * ----------------------------------------------------------------
   * Private methods
   * ----------------------------------------------------------------
  */
  _render() {
    // Stroke Color Map
    const STROKE_MAP = {
      'A': '#99DAD8',
      'B': '#D3463B',
      'X': '#A288DA',
      'Y': '#DE9367',
      'default': '#3B3A40'
    }
    // Main container
    this.element = document.createElement('div');
    this.element.className = `zone-button zone-button--${this.config.variant}`;

    // SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '295');
    svg.setAttribute('height', '289');
    svg.setAttribute('viewBox', '0 0 295 289');
    svg.setAttribute('fill', 'none');

    // SVG circular pathing
    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', 'M147.339 2C227.569 2.00026 292.677 65.7621 292.677 144.5C292.677 223.238 227.569 287 147.339 287C67.1086 287 2 223.238 2 144.5C2 65.7619 67.1086 2 147.339 2Z');
    this.svgPath.setAttribute('fill', `url(#INACTIVE_linear_zone_${this.config.label})`);
    this.svgPath.setAttribute('stroke', `${STROKE_MAP[this.config.label]}`);
    this.svgPath.setAttribute('stroke-width', '2');

    // SVG label ("A", "B", etc.)
    this.svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.svgLabel.setAttribute('x', '50%'); // center horizontally
    this.svgLabel.setAttribute('y', '50%'); // center vertically
    this.svgLabel.setAttribute('text-anchor', 'middle');
    this.svgLabel.setAttribute('dominant-baseline', 'middle');
    this.svgLabel.setAttribute('fill', '#04050D');
    this.svgLabel.setAttribute('font-weight', 'bold');
    this.svgLabel.setAttribute('font-size', '3rem');
    this.svgLabel.setAttribute('pointer-events', 'none'); // ignore click events, container will handle.
    this.svgLabel.style.userSelect = 'none'; // prevent text cursor
    this.svgLabel.textContent = this.config.label;

    // Button Color Defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = zoneColorDefs;

    // Assemble elements
    svg.appendChild(this.svgPath);
    svg.appendChild(this.svgLabel);
    svg.appendChild(defs);
    this.element.appendChild(svg);

    return this.element;
  }

  _bindEvents() {
    if (!this.svgPath) return;

    // Mouse and touch events (visual changes, no functionality)
    this.svgPath.addEventListener('pointerdown', this._handlePointerDown.bind(this));
    const buttonContainer = document.getElementById('button-area');
    if (buttonContainer) {
      buttonContainer.addEventListener('pointerup', this._handlePointerUpOutsideZone.bind(this));
    }

    // Prevent context menu on long press
    this.svgPath.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  _handlePointerDown(e) {
    e.preventDefault();
    this.setActive(true);
  }

  _handlePointerUpOutsideZone() {
    if (this.isActive) {
      this.setActive(false);
    }
  }

  /**
   * Update SVG's colors when button is held
  */
  _updateVisualState() {
    if (!this.svgPath || !this.svgLabel) return;

    if (this.isActive) {
        // Active state: red stroke and label
        // this.svgPath.setAttribute('stroke', '#D62536');
        // this.svgPath.setAttribute('stroke-width', '3');
        // this.svgLabel.setAttribute('fill', '#D62536');
        this.svgPath.setAttribute('fill', `url(#ACTIVE_linear_zone_${this.config.label})`);
        this.element.classList.add('zone-button--active');
    } else {
        // Default state
        // this.svgPath.setAttribute('stroke', '#3B3A40');
        // this.svgPath.setAttribute('stroke-width', '1');
        // this.svgLabel.setAttribute('fill', '#3B3A40');
        this.svgPath.setAttribute('fill', `url(#INACTIVE_linear_zone_${this.config.label})`);
        this.element.classList.remove('zone-button--active');
    }
  }

  _getLabelTransformCSS() {
    switch (this.config.variant) {
      case 'bottom':
        return 'scale(1)';
      case 'top':
        return 'scaleY(-1)';
      case 'left':
        return 'rotate(-90deg)';
      case 'right':
        return 'rotate(90deg)';
      default:
        return 'scale(1)';
    }
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
  setActive(active) {
    this.isActive = active;
    this._updateVisualState();
  }

  setLabel(newLabel) {
    this.config.label = newLabel;
    if (this.svgLabel) {
        this.svgLabel.textContent = newLabel;
    }
  }

  setVariant(newVariant) {
    if (this.element) {
        this.element.classList.remove(`zone-button--${this.config.variant}`);
        this.element.classList.add(`zone-button--${newVariant}`);
    }
    this.config.variant = newVariant;
  }

  getElement() {
    return this.element;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
    }
  }
}

const zoneColorDefs = `
  <linearGradient id="INACTIVE_linear_zone_A" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#7DF7F5"/>
    <stop offset="0.480769" stop-color="#31A69A"/>
    <stop offset="1" stop-color="#1C6A99"/>
  </linearGradient>
  <linearGradient id="ACTIVE_linear_zone_A" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#A8EDFE"/>
    <stop offset="0.480769" stop-color="#6DE3FF"/>
    <stop offset="1" stop-color="#4BB2FE"/>
  </linearGradient>
  <linearGradient id="INACTIVE_linear_zone_B" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F66953"/>
    <stop offset="0.480769" stop-color="#CB2E4B"/>
    <stop offset="1" stop-color="#960F39"/>
  </linearGradient>
  <linearGradient id="ACTIVE_linear_zone_B" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FE8685"/>
    <stop offset="0.480769" stop-color="#FF5882"/>
    <stop offset="1" stop-color="#C12F6E"/>
  </linearGradient>
  <linearGradient id="INACTIVE_linear_zone_X" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#B989FF"/>
    <stop offset="0.480769" stop-color="#8246FF"/>
    <stop offset="1" stop-color="#6D289E"/>
  </linearGradient>
  <linearGradient id="ACTIVE_linear_zone_X" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#C1B3FE"/>
    <stop offset="0.480769" stop-color="#BC9BFF"/>
    <stop offset="1" stop-color="#B069F8"/>
  </linearGradient>
  <linearGradient id="INACTIVE_linear_zone_Y" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FBDE65"/>
    <stop offset="0.480769" stop-color="#ECA741"/>
    <stop offset="1" stop-color="#D86542"/>
  </linearGradient>
  <linearGradient id="ACTIVE_linear_zone_Y" x1="50.5" y1="41" x2="222.5" y2="254" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FFEFBD"/>
    <stop offset="0.480769" stop-color="#FFCE8D"/>
    <stop offset="1" stop-color="#F88D60"/>
  </linearGradient>
`;