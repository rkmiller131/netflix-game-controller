import { TVRemoteButton } from './TVRemoteButton.js';

/**
 * A TVRemoteButton extension class specific to the Controller layout configuration switches,
 * where the button has an svg icon and label, and a listener for button hold events.
*/
export class LayoutSwitchButton extends TVRemoteButton {
  constructor(config = {}) {
    const layoutConfig = {
        label: 'LAYOUT',
        parentElementId: 'header',
        maxIndex: 3,
        onClick: () => {},
        ...config
    };
    super(layoutConfig);

    this.currentLayoutIndex = 0;

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
  _render() {
    // Where the button will be placed
    this.buttonContainer = document.getElementById(this.config.parentElementId);
    if (!this.buttonContainer) {
      console.warn(`No ${this.config.parentElementId} area found. Add <div id="${this.config.parentElementId}"></div> to your index.html`);
      return;
    }
    // The actual button element
    this.element = document.createElement('button');
    this.element.id = `${this.config.label.toLowerCase()}-button`;
    this.element.className = "tv-button";
    // Label text
    const labelSpan = document.createElement('span');
    labelSpan.className = `${this.config.label.toLowerCase()}-label`;
    labelSpan.textContent = this.config.label;

    // The SVG icon (inline)
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '18');
    svg.setAttribute('viewBox', '0 0 160 138');
    svg.setAttribute('fill', 'none');
    svg.classList.add(`${this.config.label.toLowerCase()}-icon`);
    const path1 = document.createElementNS(svgNS, 'path');
    path1.setAttribute(
      'd',
      'M31.196 37.0713 C14 48 9 64 16 82 C32 106 55 109 85.1958 110.071'
    );
    path1.setAttribute('stroke', 'currentColor');
    path1.setAttribute('stroke-width', '12');
    path1.setAttribute('stroke-linecap', 'round');

    const arrow1 = document.createElementNS(svgNS, 'path');
    arrow1.setAttribute(
      'd',
      'M73.6973 90.0713L95.6973 108.571L73.6973 130.571'
    );
    arrow1.setAttribute('stroke', 'currentColor');
    arrow1.setAttribute('stroke-width', '10');
    arrow1.setAttribute('stroke-linecap', 'square');

    const path2 = document.createElementNS(svgNS, 'path');
    path2.setAttribute(
      'd',
      'M128.198 100.571 C145 89.5 150 74 143 56 C127 32 104 29 74.1987 27.5713'
    );
    path2.setAttribute('stroke', 'currentColor');
    path2.setAttribute('stroke-width', '12');
    path2.setAttribute('stroke-linecap', 'round');

    const arrow2 = document.createElementNS(svgNS, 'path');
    arrow2.setAttribute(
      'd',
      'M85.6973 47.5713L63.6973 29.0713L85.6973 7.07129'
    );
    arrow2.setAttribute('stroke', 'currentColor');
    arrow2.setAttribute('stroke-width', '10');
    arrow2.setAttribute('stroke-linecap', 'square');

    svg.append(path1, arrow1, path2, arrow2);

    // Assemble the Elements!
    this.element.append(svg, labelSpan);
    this.buttonContainer.appendChild(this.element);

    return this.element;
  }

  _bindEvents() {
    if (!this.element) return;

    this.element.addEventListener('pointerdown', this._handlePointerDown.bind(this));
    this.element.addEventListener('pointerup', this._handlePointerUp.bind(this));
    // Sometimes quick switching between holds/clicks causes a "right click" context menu to appear
    this.element.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  _handlePointerDown(e) {
    e.preventDefault();
    this.toggleActive();

    this.isPointerDown = true;
    this.holdTimerRef = setTimeout(() => {
      if (this.isPointerDown) {
        this.isHolding = true;
        this.holdStartTime = Date.now() - this.holdThreshold;
      }
    }, this.holdThreshold);
  }

  _handlePointerUp(e) {
    e.stopPropagation();
    this.toggleActive();
    if (!this.isPointerDown) return;

    if (this.isHolding) {
      this._handleTouchHold(e);
    } else {
      this._handleClick(e);
    }

    this.isPointerDown = false;
    this.isHolding = false;
    this._clearTimer(this.holdTimerRef);
  }

  _handleTouchHold(e) {
    e.stopPropagation();
    this._decrementIndex();
    this.config.onClick(this);
  }

  _handleClick(e) {
    e.stopPropagation();
    this._incrementIndex();
    this.config.onClick(this);
  }

  _incrementIndex() {
    const size = this.config.maxIndex;
    this.currentLayoutIndex = (this.currentLayoutIndex + 1) % size;
  }

  _decrementIndex() {
    const size = this.config.maxIndex;
    this.currentLayoutIndex = (this.currentLayoutIndex - 1 + size) % size;
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

  updateLayoutIndex(newIndex) {
    if (
      typeof newIndex === 'number' &&
      newIndex >= 0 &&
      newIndex < this.config.maxIndex
    ) {
      this.currentLayoutIndex = newIndex;
    } else {
      console.error(`LayoutSwitchButton.updateLayoutIndex(): Invalid index ${newIndex}`);
    }
  }

  destroy() {
    this._clearTimer(this.holdTimerRef);
    super.destroy();
  }
}