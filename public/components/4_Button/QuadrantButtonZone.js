import { OneButtonZone } from '../1_Button/OneButtonZone.js';

/**
 * A configurable quadrant zone button with color changing tap states, designed for a 4-Button layout.
*/
export class QuadrantButtonZone extends OneButtonZone {
  constructor(config = {}) {
    const fourButtonConfig = {
      variant: 'bottom', // bottom, top, left, right
      ...config
    }
    super(fourButtonConfig);
  }

  /**
   * ----------------------------------------------------------------
   * Private methods (Override)
   * ----------------------------------------------------------------
  */
  _render() {
    // Main container
    this.element = document.createElement('div');
    this.element.className = `zone-button zone-button--${this.config.variant}`;

    // SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '192');
    svg.setAttribute('viewBox', '0 0 400 192');
    svg.setAttribute('fill', 'none');

    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', 'M400 191.515L0 191.515L191.515 -7.62939e-05C193.765 2.25036 196.817 3.51465 200 3.51465C203.183 3.51465 206.235 2.25036 208.485 -7.62939e-05L400 191.515Z');
    this.svgPath.setAttribute('fill', `transparent`);

    // SVG white stroke on tip and left border (75% of left edge)
    this.svgStrokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgStrokePath.setAttribute('d', 'M208.485 0C206.235 2.25036 203.183 3.51465 200 3.51465C196.817 3.51465 193.765 2.25036 191.515 0L47.879 143.636');
    this.svgStrokePath.setAttribute('stroke', '#3B3A40');
    this.svgStrokePath.setAttribute('stroke-width', '3');
    this.svgStrokePath.setAttribute('fill', 'none');

    // SVG label ("A", "B", etc.)
    this.svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.svgLabel.setAttribute('x', '50%'); // center horizontally
    this.svgLabel.setAttribute('y', '50%'); // center vertically
    this.svgLabel.setAttribute('text-anchor', 'middle');
    this.svgLabel.setAttribute('dominant-baseline', 'middle');
    this.svgLabel.setAttribute('fill', '#3B3A40');
    this.svgLabel.setAttribute('font-size', '6rem');
    this.svgLabel.setAttribute('font-weight', 'bold');
    this.svgLabel.setAttribute('pointer-events', 'none'); // ignore click events, container will handle.
    this.svgLabel.style.userSelect = 'none'; // prevent text cursor
    this.svgLabel.textContent = this.config.label;
    this.svgLabel.style.transformBox = 'fill-box';
    this.svgLabel.style.transformOrigin = 'center';
    this.svgLabel.style.transform = this._getLabelTransformCSS();

    // Assemble elements
    svg.appendChild(this.svgPath);
    svg.appendChild(this.svgLabel);
    svg.appendChild(this.svgStrokePath);
    this.element.appendChild(svg);

    return this.element;
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
        this.svgStrokePath.setAttribute('stroke', '#D62536');
        this.svgStrokePath.setAttribute('stroke-width', '3');
        this.svgLabel.setAttribute('fill', '#D62536');
    } else {
        // Default state
        this.svgPath.setAttribute('stroke', 'transparent');
        this.svgStrokePath.setAttribute('stroke', '#3B3A40');
        this.svgStrokePath.setAttribute('stroke-width', '3');
        this.svgLabel.setAttribute('fill', '#3B3A40');
    }
  }
}
