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
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.setAttribute('fill', 'none');

    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', 'M 200 0 A 200 200 0 0 1 373.2 300 L 210.4 206 A 12 12 0 0 0 200 188 Z');
    this.svgPath.setAttribute('fill', 'black');

    // SVG Left Divider stroke path
    this.svgStrokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgStrokePath.setAttribute('d', 'M 200 0 L 200 188 A 12 12 0 0 1 210.4 206');
    this.svgStrokePath.setAttribute('stroke', '#3B3A40');
    this.svgStrokePath.setAttribute('stroke-width', '3');
    this.svgStrokePath.setAttribute('stroke-linecap', 'round');
    this.svgStrokePath.setAttribute('stroke-lineJoin', 'round');
    this.svgStrokePath.setAttribute('fill', 'none');

    // SVG label ("A", "B", etc.)
    this.svgLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const cx = 200;
    const cy = 200;
    const startAngle = -90 * Math.PI / 180;
    const endAngle   =  30 * Math.PI / 180;
    const midAngle   = (startAngle + endAngle) / 2;

    const innerRadius = 12;
    const outerRadius = 200;
    const labelRadius = (innerRadius + outerRadius) / 2 + 10;

    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);

    this.svgLabel.setAttribute('x', labelX);
    this.svgLabel.setAttribute('y', labelY);
    this.svgLabel.setAttribute('text-anchor', 'middle');
    this.svgLabel.setAttribute('dominant-baseline', 'middle');
    this.svgLabel.setAttribute('fill', '#3B3A40');
    this.svgLabel.setAttribute('font-size', '48'); // use px in SVG
    this.svgLabel.setAttribute('font-weight', 'bold');
    this.svgLabel.setAttribute('pointer-events', 'none');
    this.svgLabel.textContent = this.config.label;
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
        this.element.classList.add('zone-button--active');
    } else {
        // Default state
        this.svgPath.setAttribute('stroke', 'transparent');
        this.svgStrokePath.setAttribute('stroke', '#3B3A40');
        this.svgStrokePath.setAttribute('stroke-width', '3');
        this.svgLabel.setAttribute('fill', '#3B3A40');
        this.element.classList.remove('zone-button--active');
    }
  }
}
