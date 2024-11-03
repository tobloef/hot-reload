export const inputManagerBeforeInjection = `import { Vector2 } from "../utils/math/vector2.js";
import { isMouseButton, mouseButtonToButtonNumber } from "./mouse-button.js";
import { CustomError } from "../utils/errors/custom-error.js";

/** @import { MouseButton } from "./mouse-button.js"; */

export class InputManager {
  /** @type {InputState | undefined} */
  #prevState = undefined;

  /** @type {InputState | undefined} */
  #currentState = undefined;

  /** @type {InputState} */
  #nextState = new InputState();

  constructor() {
    this.#setupInputEventListeners();
  }

  /**
   * @param {Keycode | MouseButton} button
   */
  isPressed(button) {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    return this.#currentState.isPressed(button);
  }

  get mousePosition() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    return this.#currentState.mousePosition.copy();
  }

  get mousePositionDelta() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    if (this.#prevState === undefined) {
      return Vector2.zero;
    }

    return this.#currentState.getMousePositionDelta(
      this.#prevState.mousePosition
    );
  }

  get mouseScrollDelta() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    if (this.#prevState === undefined) {
      return 0;
    }

    return this.#currentState.getMouseScrollDelta(
      this.#prevState.mouseScroll
    );
  }

  get previous() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    let stateToUse = this.#prevState ?? this.#currentState;

    return {
      isPressed: stateToUse.isPressed,
      mousePosition: stateToUse.mousePosition,
    };
  }

  update() {
    this.#moveCurrentStateToPrevState();
    this.#moveNextStateToCurrentState();
    this.#copyNextStateToNewNextState();
  }

  #moveCurrentStateToPrevState() {
    if (this.#currentState !== undefined) {
      if (this.#prevState === undefined) {
        this.#prevState = new InputState();
      }

      this.#prevState.keys = this.#currentState.keys;
      this.#prevState.mouseButtons = this.#currentState.mouseButtons;
      this.#prevState.mousePosition = this.#currentState.mousePosition;
      this.#prevState.mouseScroll = this.#currentState.mouseScroll;
    }
  }

  #moveNextStateToCurrentState() {
    if (this.#currentState === undefined) {
      this.#currentState = new InputState();
    }

    this.#currentState.keys = this.#nextState.keys;
    this.#currentState.mouseButtons = this.#nextState.mouseButtons;
    this.#currentState.mousePosition = this.#nextState.mousePosition;
    this.#currentState.mouseScroll = this.#nextState.mouseScroll;
  }

  #copyNextStateToNewNextState() {
    this.#nextState.keys = { ...this.#nextState.keys };
    this.#nextState.mouseButtons = { ...this.#nextState.mouseButtons };
    this.#nextState.mousePosition = this.#nextState.mousePosition.copy();
  }

  #setupInputEventListeners() {
    document.addEventListener("keydown", (e) => {
      this.#nextState.keys[e.code] = true;
    });

    document.addEventListener("keyup", (e) => {
      this.#nextState.keys[e.code] = false;
    });

    document.addEventListener("mousedown", (e) => {
      this.#nextState.mouseButtons[e.button] = true;
    });

    document.addEventListener("mouseup", (e) => {
      this.#nextState.mouseButtons[e.button] = false;
    });

    document.addEventListener("mouseleave", (e) => {
      for (const button in this.#nextState.mouseButtons) {
        this.#nextState.mouseButtons[button] = false;
      }
    });

    document.addEventListener("mousemove", (e) => {
      this.#nextState.mousePosition.x = e.clientX;
      this.#nextState.mousePosition.y = e.clientY
    });

    document.addEventListener("wheel", (e) => {
      this.#nextState.mouseScroll += e.deltaY;
    });
  }
}

export class InputState {
  /** @type {Record<string, boolean>} */
  keys = {};
  /** @type {Record<number, boolean>} */
  mouseButtons = {};
  /** @type {Vector2} */
  mousePosition = Vector2.zero;
  /** @type {number} */
  mouseScroll = 0;

  /**
   * @param {Keycode | MouseButton} button
   * @returns {boolean}
   */
  isPressed(button) {
    if (this.keys[button]) {
      return true;
    }

    if (isMouseButton(button)) {
      const buttonNumber = mouseButtonToButtonNumber(button);
      return this.mouseButtons[buttonNumber] ?? false;
    }

    return false;
  }

  /**
   * @param {Vector2} prevPosition
   */
  getMousePositionDelta(prevPosition) {
    return this.mousePosition.copy().subtract(prevPosition)
  }

  /**
   * @param {number} prevScroll
   */
  getMouseScrollDelta(prevScroll) {
    return this.mouseScroll - prevScroll;
  }
}

export class InputNotUpdatedError extends CustomError {
  constructor() {
    super("Input has not been updated yet. Make sure to call \`updateInputs\` at the beginning of your update loop.");
  }
}
`;

export const inputManagerAfterInjection = `////////// START OF INJECTED HOT-RELOAD CODE //////////

let Vector2;
let isMouseButton;
let mouseButtonToButtonNumber;
let CustomError;

await (async () => {
\tconst { HotModuleReload } = await import("@tobloef/hot-reload");

\tconst hmr = new HotModuleReload(import.meta.url);

\thmr.onReload("../utils/math/vector2.js", "src/utils/math/vector2.js", (newModule) => {
\tVector2 = newModule["Vector2"];
\treturn true;
});
\thmr.onReload("./mouse-button.js", "src/input/mouse-button.js", (newModule) => {
\tisMouseButton = newModule["isMouseButton"];
\treturn true;
});
\thmr.onReload("./mouse-button.js", "src/input/mouse-button.js", (newModule) => {
\tmouseButtonToButtonNumber = newModule["mouseButtonToButtonNumber"];
\treturn true;
});
\thmr.onReload("../utils/errors/custom-error.js", "src/utils/errors/custom-error.js", (newModule) => {
\tCustomError = newModule["CustomError"];
\treturn true;
});

\tVector2 = (await hmr.getModule("../utils/math/vector2.js"))["Vector2"];
\tisMouseButton = (await hmr.getModule("./mouse-button.js"))["isMouseButton"];
\tmouseButtonToButtonNumber = (await hmr.getModule("./mouse-button.js"))["mouseButtonToButtonNumber"];
\tCustomError = (await hmr.getModule("../utils/errors/custom-error.js"))["CustomError"];
})();

////////// END OF INJECTED HOT-RELOAD CODE //////////

/*import { Vector2 } from "../utils/math/vector2.js";*/
/*import { isMouseButton, mouseButtonToButtonNumber } from "./mouse-button.js";*/
/*import { CustomError } from "../utils/errors/custom-error.js";*/

/** @import { MouseButton } from "./mouse-button.js"; */

export class InputManager {
  /** @type {InputState | undefined} */
  #prevState = undefined;

  /** @type {InputState | undefined} */
  #currentState = undefined;

  /** @type {InputState} */
  #nextState = new InputState();

  constructor() {
    this.#setupInputEventListeners();
  }

  /**
   * @param {Keycode | MouseButton} button
   */
  isPressed(button) {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    return this.#currentState.isPressed(button);
  }

  get mousePosition() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    return this.#currentState.mousePosition.copy();
  }

  get mousePositionDelta() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    if (this.#prevState === undefined) {
      return Vector2.zero;
    }

    return this.#currentState.getMousePositionDelta(
      this.#prevState.mousePosition
    );
  }

  get mouseScrollDelta() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    if (this.#prevState === undefined) {
      return 0;
    }

    return this.#currentState.getMouseScrollDelta(
      this.#prevState.mouseScroll
    );
  }

  get previous() {
    if (this.#currentState === undefined) {
      throw new InputNotUpdatedError();
    }

    let stateToUse = this.#prevState ?? this.#currentState;

    return {
      isPressed: stateToUse.isPressed,
      mousePosition: stateToUse.mousePosition,
    };
  }

  update() {
    this.#moveCurrentStateToPrevState();
    this.#moveNextStateToCurrentState();
    this.#copyNextStateToNewNextState();
  }

  #moveCurrentStateToPrevState() {
    if (this.#currentState !== undefined) {
      if (this.#prevState === undefined) {
        this.#prevState = new InputState();
      }

      this.#prevState.keys = this.#currentState.keys;
      this.#prevState.mouseButtons = this.#currentState.mouseButtons;
      this.#prevState.mousePosition = this.#currentState.mousePosition;
      this.#prevState.mouseScroll = this.#currentState.mouseScroll;
    }
  }

  #moveNextStateToCurrentState() {
    if (this.#currentState === undefined) {
      this.#currentState = new InputState();
    }

    this.#currentState.keys = this.#nextState.keys;
    this.#currentState.mouseButtons = this.#nextState.mouseButtons;
    this.#currentState.mousePosition = this.#nextState.mousePosition;
    this.#currentState.mouseScroll = this.#nextState.mouseScroll;
  }

  #copyNextStateToNewNextState() {
    this.#nextState.keys = { ...this.#nextState.keys };
    this.#nextState.mouseButtons = { ...this.#nextState.mouseButtons };
    this.#nextState.mousePosition = this.#nextState.mousePosition.copy();
  }

  #setupInputEventListeners() {
    document.addEventListener("keydown", (e) => {
      this.#nextState.keys[e.code] = true;
    });

    document.addEventListener("keyup", (e) => {
      this.#nextState.keys[e.code] = false;
    });

    document.addEventListener("mousedown", (e) => {
      this.#nextState.mouseButtons[e.button] = true;
    });

    document.addEventListener("mouseup", (e) => {
      this.#nextState.mouseButtons[e.button] = false;
    });

    document.addEventListener("mouseleave", (e) => {
      for (const button in this.#nextState.mouseButtons) {
        this.#nextState.mouseButtons[button] = false;
      }
    });

    document.addEventListener("mousemove", (e) => {
      this.#nextState.mousePosition.x = e.clientX;
      this.#nextState.mousePosition.y = e.clientY
    });

    document.addEventListener("wheel", (e) => {
      this.#nextState.mouseScroll += e.deltaY;
    });
  }
}

export class InputState {
  /** @type {Record<string, boolean>} */
  keys = {};
  /** @type {Record<number, boolean>} */
  mouseButtons = {};
  /** @type {Vector2} */
  mousePosition = Vector2.zero;
  /** @type {number} */
  mouseScroll = 0;

  /**
   * @param {Keycode | MouseButton} button
   * @returns {boolean}
   */
  isPressed(button) {
    if (this.keys[button]) {
      return true;
    }

    if (isMouseButton(button)) {
      const buttonNumber = mouseButtonToButtonNumber(button);
      return this.mouseButtons[buttonNumber] ?? false;
    }

    return false;
  }

  /**
   * @param {Vector2} prevPosition
   */
  getMousePositionDelta(prevPosition) {
    return this.mousePosition.copy().subtract(prevPosition)
  }

  /**
   * @param {number} prevScroll
   */
  getMouseScrollDelta(prevScroll) {
    return this.mouseScroll - prevScroll;
  }
}

export class InputNotUpdatedError extends CustomError {
  constructor() {
    super("Input has not been updated yet. Make sure to call \`updateInputs\` at the beginning of your update loop.");
  }
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQvaW5wdXQtbWFuYWdlci5qcyIsInNvdXJjZXMiOlsiaW5wdXQvaW5wdXQtbWFuYWdlci5qcyJdLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC92ZWN0b3IyLmpzXCI7XG5pbXBvcnQgeyBpc01vdXNlQnV0dG9uLCBtb3VzZUJ1dHRvblRvQnV0dG9uTnVtYmVyIH0gZnJvbSBcIi4vbW91c2UtYnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBDdXN0b21FcnJvciB9IGZyb20gXCIuLi91dGlscy9lcnJvcnMvY3VzdG9tLWVycm9yLmpzXCI7XG5cbi8qKiBAaW1wb3J0IHsgTW91c2VCdXR0b24gfSBmcm9tIFwiLi9tb3VzZS1idXR0b24uanNcIjsgKi9cblxuZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlciB7XG4gIC8qKiBAdHlwZSB7SW5wdXRTdGF0ZSB8IHVuZGVmaW5lZH0gKi9cbiAgI3ByZXZTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAvKiogQHR5cGUge0lucHV0U3RhdGUgfCB1bmRlZmluZWR9ICovXG4gICNjdXJyZW50U3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgLyoqIEB0eXBlIHtJbnB1dFN0YXRlfSAqL1xuICAjbmV4dFN0YXRlID0gbmV3IElucHV0U3RhdGUoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLiNzZXR1cElucHV0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0tleWNvZGUgfCBNb3VzZUJ1dHRvbn0gYnV0dG9uXG4gICAqL1xuICBpc1ByZXNzZWQoYnV0dG9uKSB7XG4gICAgaWYgKHRoaXMuI2N1cnJlbnRTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgSW5wdXROb3RVcGRhdGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jY3VycmVudFN0YXRlLmlzUHJlc3NlZChidXR0b24pO1xuICB9XG5cbiAgZ2V0IG1vdXNlUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuI2N1cnJlbnRTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgSW5wdXROb3RVcGRhdGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jY3VycmVudFN0YXRlLm1vdXNlUG9zaXRpb24uY29weSgpO1xuICB9XG5cbiAgZ2V0IG1vdXNlUG9zaXRpb25EZWx0YSgpIHtcbiAgICBpZiAodGhpcy4jY3VycmVudFN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBJbnB1dE5vdFVwZGF0ZWRFcnJvcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiNwcmV2U3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFZlY3RvcjIuemVybztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jY3VycmVudFN0YXRlLmdldE1vdXNlUG9zaXRpb25EZWx0YShcbiAgICAgIHRoaXMuI3ByZXZTdGF0ZS5tb3VzZVBvc2l0aW9uXG4gICAgKTtcbiAgfVxuXG4gIGdldCBtb3VzZVNjcm9sbERlbHRhKCkge1xuICAgIGlmICh0aGlzLiNjdXJyZW50U3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IElucHV0Tm90VXBkYXRlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuI3ByZXZTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4jY3VycmVudFN0YXRlLmdldE1vdXNlU2Nyb2xsRGVsdGEoXG4gICAgICB0aGlzLiNwcmV2U3RhdGUubW91c2VTY3JvbGxcbiAgICApO1xuICB9XG5cbiAgZ2V0IHByZXZpb3VzKCkge1xuICAgIGlmICh0aGlzLiNjdXJyZW50U3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IElucHV0Tm90VXBkYXRlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgbGV0IHN0YXRlVG9Vc2UgPSB0aGlzLiNwcmV2U3RhdGUgPz8gdGhpcy4jY3VycmVudFN0YXRlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzUHJlc3NlZDogc3RhdGVUb1VzZS5pc1ByZXNzZWQsXG4gICAgICBtb3VzZVBvc2l0aW9uOiBzdGF0ZVRvVXNlLm1vdXNlUG9zaXRpb24sXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLiNtb3ZlQ3VycmVudFN0YXRlVG9QcmV2U3RhdGUoKTtcbiAgICB0aGlzLiNtb3ZlTmV4dFN0YXRlVG9DdXJyZW50U3RhdGUoKTtcbiAgICB0aGlzLiNjb3B5TmV4dFN0YXRlVG9OZXdOZXh0U3RhdGUoKTtcbiAgfVxuXG4gICNtb3ZlQ3VycmVudFN0YXRlVG9QcmV2U3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuI2N1cnJlbnRTdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy4jcHJldlN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jcHJldlN0YXRlID0gbmV3IElucHV0U3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy4jcHJldlN0YXRlLmtleXMgPSB0aGlzLiNjdXJyZW50U3RhdGUua2V5cztcbiAgICAgIHRoaXMuI3ByZXZTdGF0ZS5tb3VzZUJ1dHRvbnMgPSB0aGlzLiNjdXJyZW50U3RhdGUubW91c2VCdXR0b25zO1xuICAgICAgdGhpcy4jcHJldlN0YXRlLm1vdXNlUG9zaXRpb24gPSB0aGlzLiNjdXJyZW50U3RhdGUubW91c2VQb3NpdGlvbjtcbiAgICAgIHRoaXMuI3ByZXZTdGF0ZS5tb3VzZVNjcm9sbCA9IHRoaXMuI2N1cnJlbnRTdGF0ZS5tb3VzZVNjcm9sbDtcbiAgICB9XG4gIH1cblxuICAjbW92ZU5leHRTdGF0ZVRvQ3VycmVudFN0YXRlKCkge1xuICAgIGlmICh0aGlzLiNjdXJyZW50U3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy4jY3VycmVudFN0YXRlID0gbmV3IElucHV0U3RhdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLiNjdXJyZW50U3RhdGUua2V5cyA9IHRoaXMuI25leHRTdGF0ZS5rZXlzO1xuICAgIHRoaXMuI2N1cnJlbnRTdGF0ZS5tb3VzZUJ1dHRvbnMgPSB0aGlzLiNuZXh0U3RhdGUubW91c2VCdXR0b25zO1xuICAgIHRoaXMuI2N1cnJlbnRTdGF0ZS5tb3VzZVBvc2l0aW9uID0gdGhpcy4jbmV4dFN0YXRlLm1vdXNlUG9zaXRpb247XG4gICAgdGhpcy4jY3VycmVudFN0YXRlLm1vdXNlU2Nyb2xsID0gdGhpcy4jbmV4dFN0YXRlLm1vdXNlU2Nyb2xsO1xuICB9XG5cbiAgI2NvcHlOZXh0U3RhdGVUb05ld05leHRTdGF0ZSgpIHtcbiAgICB0aGlzLiNuZXh0U3RhdGUua2V5cyA9IHsgLi4udGhpcy4jbmV4dFN0YXRlLmtleXMgfTtcbiAgICB0aGlzLiNuZXh0U3RhdGUubW91c2VCdXR0b25zID0geyAuLi50aGlzLiNuZXh0U3RhdGUubW91c2VCdXR0b25zIH07XG4gICAgdGhpcy4jbmV4dFN0YXRlLm1vdXNlUG9zaXRpb24gPSB0aGlzLiNuZXh0U3RhdGUubW91c2VQb3NpdGlvbi5jb3B5KCk7XG4gIH1cblxuICAjc2V0dXBJbnB1dEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICB0aGlzLiNuZXh0U3RhdGUua2V5c1tlLmNvZGVdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy4jbmV4dFN0YXRlLmtleXNbZS5jb2RlXSA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy4jbmV4dFN0YXRlLm1vdXNlQnV0dG9uc1tlLmJ1dHRvbl0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcbiAgICAgIHRoaXMuI25leHRTdGF0ZS5tb3VzZUJ1dHRvbnNbZS5idXR0b25dID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBidXR0b24gaW4gdGhpcy4jbmV4dFN0YXRlLm1vdXNlQnV0dG9ucykge1xuICAgICAgICB0aGlzLiNuZXh0U3RhdGUubW91c2VCdXR0b25zW2J1dHRvbl0gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IHtcbiAgICAgIHRoaXMuI25leHRTdGF0ZS5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFg7XG4gICAgICB0aGlzLiNuZXh0U3RhdGUubW91c2VQb3NpdGlvbi55ID0gZS5jbGllbnRZXG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgKGUpID0+IHtcbiAgICAgIHRoaXMuI25leHRTdGF0ZS5tb3VzZVNjcm9sbCArPSBlLmRlbHRhWTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5wdXRTdGF0ZSB7XG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgYm9vbGVhbj59ICovXG4gIGtleXMgPSB7fTtcbiAgLyoqIEB0eXBlIHtSZWNvcmQ8bnVtYmVyLCBib29sZWFuPn0gKi9cbiAgbW91c2VCdXR0b25zID0ge307XG4gIC8qKiBAdHlwZSB7VmVjdG9yMn0gKi9cbiAgbW91c2VQb3NpdGlvbiA9IFZlY3RvcjIuemVybztcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gIG1vdXNlU2Nyb2xsID0gMDtcblxuICAvKipcbiAgICogQHBhcmFtIHtLZXljb2RlIHwgTW91c2VCdXR0b259IGJ1dHRvblxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzUHJlc3NlZChidXR0b24pIHtcbiAgICBpZiAodGhpcy5rZXlzW2J1dHRvbl0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpc01vdXNlQnV0dG9uKGJ1dHRvbikpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbk51bWJlciA9IG1vdXNlQnV0dG9uVG9CdXR0b25OdW1iZXIoYnV0dG9uKTtcbiAgICAgIHJldHVybiB0aGlzLm1vdXNlQnV0dG9uc1tidXR0b25OdW1iZXJdID8/IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1ZlY3RvcjJ9IHByZXZQb3NpdGlvblxuICAgKi9cbiAgZ2V0TW91c2VQb3NpdGlvbkRlbHRhKHByZXZQb3NpdGlvbikge1xuICAgIHJldHVybiB0aGlzLm1vdXNlUG9zaXRpb24uY29weSgpLnN1YnRyYWN0KHByZXZQb3NpdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlNjcm9sbFxuICAgKi9cbiAgZ2V0TW91c2VTY3JvbGxEZWx0YShwcmV2U2Nyb2xsKSB7XG4gICAgcmV0dXJuIHRoaXMubW91c2VTY3JvbGwgLSBwcmV2U2Nyb2xsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnB1dE5vdFVwZGF0ZWRFcnJvciBleHRlbmRzIEN1c3RvbUVycm9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXCJJbnB1dCBoYXMgbm90IGJlZW4gdXBkYXRlZCB5ZXQuIE1ha2Ugc3VyZSB0byBjYWxsIGB1cGRhdGVJbnB1dHNgIGF0IHRoZSBiZWdpbm5pbmcgb2YgeW91ciB1cGRhdGUgbG9vcC5cIik7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSJ9`;