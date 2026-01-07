/**
 * A button that looks like a beveled, light-illusioned TV Remote Button.
 * Used in the Controller class to handle custom input transitions like
 * menu popups or layout switches that send game messages to Unreal Engine.
*/
export class TVRemoteButton {
  constructor(config = {}) {
    // Default configuration if none passed to constructor
    this.config = {
        label: 'TACTICS',
        parentElementId: 'footer',
        onClick: () => {},
        ...config
    };

    this.buttonContainer = null;
    this.element = null;
    this.isActive = false;
    this.onClickHandler = null;

    this._render();
    this._bindEvents();
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
    this.element.textContent = this.config.label;
    this.buttonContainer.appendChild(this.element);

    return this.element;
  }

  _bindEvents() {
    if (!this.element) return;

    this.onClickHandler = () => {
      this.toggleActive();
      this.config.onClick(this);
    }

    this.element.addEventListener('click', this.onClickHandler);
  }

  /**
   * Update button's visual state when the menu is open
  */
  _updateVisualState() {
    if (!this.element) return;

    this.element.classList.toggle('active', this.isActive);
  }

  /**
   * ----------------------------------------------------------------
   * Public methods
   * ----------------------------------------------------------------
  */
  toggleActive() {
    this.isActive = !this.isActive;
    this._updateVisualState();
  }

  setLabel(newLabel) {
    this.config.label = newLabel;
    if (this.element) {
      this.element.textContent = newLabel;
    }
  }

  getElement() {
    return this.element;
  }

  destroy() {
    if (!this.element) return;

    if (this._onClickHandler) {
      this.element.removeEventListener('click', this._onClickHandler);
    }

    this.element.remove();
    this.element = null;
    this.buttonContainer = null;
  }
}