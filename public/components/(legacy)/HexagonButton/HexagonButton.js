/**
 * A configurable hexagon button with color changing tap states.
*/
export class HexagonButton {
  constructor(config = {}) {
    // Default configuration if none passed to constructor
    this.config = {
        label: 'A',
        variant: 'primary', // primary, secondary, tertiary, singular
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
    // Main container
    this.element = document.createElement('div');
    this.element.className = `hexagon-button hexagon-button--${this.config.variant}`;

    // SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '102');
    svg.setAttribute('height', '87');
    svg.setAttribute('viewBox', '0 0 99 87');
    svg.setAttribute('fill', 'none');

    // SVG Linear gradient background
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.setAttribute('id', `hexGradient-${Math.random().toString(36).substr(2, 9)}`); // uuid
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '100%');
    linearGradient.setAttribute('x2', '100%');
    linearGradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#27222eff');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#383446');

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);

    // SVG hexagon pathing
    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', 'M74.0792 1.24953L98.5406 43.618L74.0797 85.9867L25.1568 85.9861L0.695396 43.6177L25.1563 1.24898L74.0792 1.24953Z');
    // this.svgPath.setAttribute('fill', '#383446'); // <- if  you just want a solid color instead
    this.svgPath.setAttribute('fill', `url(#${linearGradient.id})`);
    this.svgPath.setAttribute('stroke', '#151220');
    this.svgPath.setAttribute('stroke-width', '1');

    // SVG label ("A", "B", "Pass", etc.)
    this.svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.svgLabel.setAttribute('x', '50%'); // center horizontally
    this.svgLabel.setAttribute('y', '50%'); // center vertically
    this.svgLabel.setAttribute('text-anchor', 'middle');
    this.svgLabel.setAttribute('dominant-baseline', 'middle');
    this.svgLabel.setAttribute('fill', '#151220');
    this.svgLabel.setAttribute('font-weight', 'bold');
    this.svgLabel.setAttribute('pointer-events', 'none'); // ignore click events, container will handle.
    this.svgLabel.style.userSelect = 'none'; // prevent text cursor
    this.svgLabel.textContent = this.config.label;

    // Assemble elements
    svg.appendChild(defs);
    svg.appendChild(this.svgPath);
    svg.appendChild(this.svgLabel);
    this.element.appendChild(svg);

    return this.element;
  }

  _bindEvents() {
    if (!this.svgPath) return;

    // Mouse and touch events (visual changes, no functionality)
    this.svgPath.addEventListener('pointerdown', this._handlePointerDown.bind(this));
    const buttonContainer = document.getElementById('button-container');
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
        this.svgPath.setAttribute('stroke', '#D62536');
        this.svgPath.setAttribute('stroke-width', '3');
        this.svgLabel.setAttribute('fill', '#D62536');
        this.element.classList.add('hexagon-button--active');
    } else {
        // Default state
        this.svgPath.setAttribute('stroke', '#151220');
        this.svgPath.setAttribute('stroke-width', '1');
        this.svgLabel.setAttribute('fill', '#151220');
        this.element.classList.remove('hexagon-button--active');
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
        this.element.classList.remove(`hexagon-button--${this.config.variant}`);
        this.element.classList.add(`hexagon-button--${newVariant}`);
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
