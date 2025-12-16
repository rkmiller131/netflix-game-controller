import { OneButtonZone } from '../1_Button/OneButtonZone.js';

/**
 * A configurable quadrant zone button with color changing tap states, designed for a 4-Button layout.
*/
export class ThreeButtonZone extends OneButtonZone {
  constructor(config = {}) {
    const threeButtonConfig = {
      variant: 'bottom', // bottom, left, right
      ...config
    }
    super(threeButtonConfig);
  }

  /**
   * ----------------------------------------------------------------
   * Private methods (Override)
   * ----------------------------------------------------------------
  */
  _render() {
    // Main container
    this.element = document.createElement('div');
    this.element.className = `wedge-button wedge-button--${this.config.variant}`;

    // SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '201');
    svg.setAttribute('height', '301');
    svg.setAttribute('viewBox', '0 0 201 301');
    svg.setAttribute('fill', 'none');

    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', 'M1 1C36.1069 1.00089 70.5951 10.2428 100.998 27.7968C131.401 45.3509 156.648 70.5985 174.201 101.002C191.754 131.406 200.995 165.894 200.995 201.001C200.995 236.108 191.753 270.597 174.2 301L11.4 207C12.4535 205.175 13.008 203.105 13.0077 200.998C13.0074 198.891 12.4522 196.821 11.3981 194.997C10.3439 193.172 8.828 191.657 7.0027 190.605C5.1774 189.552 3.10709 188.999 1 189L1 1Z');
    this.svgPath.setAttribute('fill', 'transparent');

    // SVG Left Divider stroke path
    this.svgStrokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgStrokePath.setAttribute('d', 'M1 1L1 189C3.10709 188.999 5.1774 189.552 7.0027 190.605C8.828 191.657 10.3439 193.172 11.3981 194.997C12.4522 196.821 13.0074 198.891 13.0077 200.998C13.008 203.105 12.4535 205.175 11.4 207');
    this.svgStrokePath.setAttribute('stroke', '#3B3A40');
    this.svgStrokePath.setAttribute('stroke-width', '3');
    this.svgStrokePath.setAttribute('stroke-linecap', 'round');
    this.svgStrokePath.setAttribute('stroke-lineJoin', 'round');

    // SVG label ("A", "B", etc.)
    this.svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.svgLabel.setAttribute('x', '50%'); // center horizontally
    this.svgLabel.setAttribute('y', '50%'); // center vertically
    this.svgLabel.setAttribute('text-anchor', 'middle');
    this.svgLabel.setAttribute('dominant-baseline', 'middle');
    this.svgLabel.setAttribute('fill', '#3B3A40');
    this.svgLabel.setAttribute('font-weight', 'bold');
    this.svgLabel.setAttribute('font-size', '3rem');
    this.svgLabel.setAttribute('pointer-events', 'none'); // ignore click events, container will handle.
    this.svgLabel.style.userSelect = 'none'; // prevent text cursor
    this.svgLabel.textContent = this.config.label;
    const labelRotations = {
        'right': 0,
        'bottom': 120,
        'left': 240
    };
    const labelRotation = labelRotations[this.config.variant];
    // Counter-rotate the label to keep it upright
    this.svgLabel.setAttribute('transform', `rotate(${-labelRotation} 100.5 150.5)`);
    // 100.5, 150.5 is the center of the SVG viewBox (201/2, 301/2)

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
        this.element.classList.add('wedge-button--active');
    } else {
        // Default state
        this.svgPath.setAttribute('stroke', 'transparent');
        this.svgStrokePath.setAttribute('stroke', '#3B3A40');
        this.svgStrokePath.setAttribute('stroke-width', '3');
        this.svgLabel.setAttribute('fill', '#3B3A40');
        this.element.classList.remove('wedge-button--active');
    }
  }
}
