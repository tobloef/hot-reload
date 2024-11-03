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

\thmr.onReload("../utils/math/vector2.js", (newModule) => {
\tVector2 = newModule["Vector2"];
\treturn true;
});
\thmr.onReload("./mouse-button.js", (newModule) => {
\tisMouseButton = newModule["isMouseButton"];
\treturn true;
});
\thmr.onReload("./mouse-button.js", (newModule) => {
\tmouseButtonToButtonNumber = newModule["mouseButtonToButtonNumber"];
\treturn true;
});
\thmr.onReload("../utils/errors/custom-error.js", (newModule) => {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQvaW5wdXQtbWFuYWdlcmpzIiwic291cmNlcyI6WyJpbnB1dC9pbnB1dC1tYW5hZ2VyanMiXSwic291cmNlUm9vdCI6Ii8uIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi91dGlscy9tYXRoL3ZlY3RvcjIuanNcIjtcbmltcG9ydCB7IGlzTW91c2VCdXR0b24sIG1vdXNlQnV0dG9uVG9CdXR0b25OdW1iZXIgfSBmcm9tIFwiLi9tb3VzZS1idXR0b24uanNcIjtcbmltcG9ydCB7IEN1c3RvbUVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9ycy9jdXN0b20tZXJyb3IuanNcIjtcblxuLyoqIEBpbXBvcnQgeyBNb3VzZUJ1dHRvbiB9IGZyb20gXCIuL21vdXNlLWJ1dHRvbi5qc1wiOyAqL1xuXG5leHBvcnQgY2xhc3MgSW5wdXRNYW5hZ2VyIHtcbiAgLyoqIEB0eXBlIHtJbnB1dFN0YXRlIHwgdW5kZWZpbmVkfSAqL1xuICAjcHJldlN0YXRlID0gdW5kZWZpbmVkO1xuXG4gIC8qKiBAdHlwZSB7SW5wdXRTdGF0ZSB8IHVuZGVmaW5lZH0gKi9cbiAgI2N1cnJlbnRTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAvKiogQHR5cGUge0lucHV0U3RhdGV9ICovXG4gICNuZXh0U3RhdGUgPSBuZXcgSW5wdXRTdGF0ZSgpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuI3NldHVwSW5wdXRFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7S2V5Y29kZSB8IE1vdXNlQnV0dG9ufSBidXR0b25cbiAgICovXG4gIGlzUHJlc3NlZChidXR0b24pIHtcbiAgICBpZiAodGhpcy4jY3VycmVudFN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBJbnB1dE5vdFVwZGF0ZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNjdXJyZW50U3RhdGUuaXNQcmVzc2VkKGJ1dHRvbik7XG4gIH1cblxuICBnZXQgbW91c2VQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy4jY3VycmVudFN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBJbnB1dE5vdFVwZGF0ZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNjdXJyZW50U3RhdGUubW91c2VQb3NpdGlvbi5jb3B5KCk7XG4gIH1cblxuICBnZXQgbW91c2VQb3NpdGlvbkRlbHRhKCkge1xuICAgIGlmICh0aGlzLiNjdXJyZW50U3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IElucHV0Tm90VXBkYXRlZEVycm9yKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuI3ByZXZTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gVmVjdG9yMi56ZXJvO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNjdXJyZW50U3RhdGUuZ2V0TW91c2VQb3NpdGlvbkRlbHRhKFxuICAgICAgdGhpcy4jcHJldlN0YXRlLm1vdXNlUG9zaXRpb25cbiAgICApO1xuICB9XG5cbiAgZ2V0IG1vdXNlU2Nyb2xsRGVsdGEoKSB7XG4gICAgaWYgKHRoaXMuI2N1cnJlbnRTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgSW5wdXROb3RVcGRhdGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy4jcHJldlN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNjdXJyZW50U3RhdGUuZ2V0TW91c2VTY3JvbGxEZWx0YShcbiAgICAgIHRoaXMuI3ByZXZTdGF0ZS5tb3VzZVNjcm9sbFxuICAgICk7XG4gIH1cblxuICBnZXQgcHJldmlvdXMoKSB7XG4gICAgaWYgKHRoaXMuI2N1cnJlbnRTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgSW5wdXROb3RVcGRhdGVkRXJyb3IoKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhdGVUb1VzZSA9IHRoaXMuI3ByZXZTdGF0ZSA/PyB0aGlzLiNjdXJyZW50U3RhdGU7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNQcmVzc2VkOiBzdGF0ZVRvVXNlLmlzUHJlc3NlZCxcbiAgICAgIG1vdXNlUG9zaXRpb246IHN0YXRlVG9Vc2UubW91c2VQb3NpdGlvbixcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuI21vdmVDdXJyZW50U3RhdGVUb1ByZXZTdGF0ZSgpO1xuICAgIHRoaXMuI21vdmVOZXh0U3RhdGVUb0N1cnJlbnRTdGF0ZSgpO1xuICAgIHRoaXMuI2NvcHlOZXh0U3RhdGVUb05ld05leHRTdGF0ZSgpO1xuICB9XG5cbiAgI21vdmVDdXJyZW50U3RhdGVUb1ByZXZTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy4jY3VycmVudFN0YXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLiNwcmV2U3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNwcmV2U3RhdGUgPSBuZXcgSW5wdXRTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiNwcmV2U3RhdGUua2V5cyA9IHRoaXMuI2N1cnJlbnRTdGF0ZS5rZXlzO1xuICAgICAgdGhpcy4jcHJldlN0YXRlLm1vdXNlQnV0dG9ucyA9IHRoaXMuI2N1cnJlbnRTdGF0ZS5tb3VzZUJ1dHRvbnM7XG4gICAgICB0aGlzLiNwcmV2U3RhdGUubW91c2VQb3NpdGlvbiA9IHRoaXMuI2N1cnJlbnRTdGF0ZS5tb3VzZVBvc2l0aW9uO1xuICAgICAgdGhpcy4jcHJldlN0YXRlLm1vdXNlU2Nyb2xsID0gdGhpcy4jY3VycmVudFN0YXRlLm1vdXNlU2Nyb2xsO1xuICAgIH1cbiAgfVxuXG4gICNtb3ZlTmV4dFN0YXRlVG9DdXJyZW50U3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuI2N1cnJlbnRTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLiNjdXJyZW50U3RhdGUgPSBuZXcgSW5wdXRTdGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuI2N1cnJlbnRTdGF0ZS5rZXlzID0gdGhpcy4jbmV4dFN0YXRlLmtleXM7XG4gICAgdGhpcy4jY3VycmVudFN0YXRlLm1vdXNlQnV0dG9ucyA9IHRoaXMuI25leHRTdGF0ZS5tb3VzZUJ1dHRvbnM7XG4gICAgdGhpcy4jY3VycmVudFN0YXRlLm1vdXNlUG9zaXRpb24gPSB0aGlzLiNuZXh0U3RhdGUubW91c2VQb3NpdGlvbjtcbiAgICB0aGlzLiNjdXJyZW50U3RhdGUubW91c2VTY3JvbGwgPSB0aGlzLiNuZXh0U3RhdGUubW91c2VTY3JvbGw7XG4gIH1cblxuICAjY29weU5leHRTdGF0ZVRvTmV3TmV4dFN0YXRlKCkge1xuICAgIHRoaXMuI25leHRTdGF0ZS5rZXlzID0geyAuLi50aGlzLiNuZXh0U3RhdGUua2V5cyB9O1xuICAgIHRoaXMuI25leHRTdGF0ZS5tb3VzZUJ1dHRvbnMgPSB7IC4uLnRoaXMuI25leHRTdGF0ZS5tb3VzZUJ1dHRvbnMgfTtcbiAgICB0aGlzLiNuZXh0U3RhdGUubW91c2VQb3NpdGlvbiA9IHRoaXMuI25leHRTdGF0ZS5tb3VzZVBvc2l0aW9uLmNvcHkoKTtcbiAgfVxuXG4gICNzZXR1cElucHV0RXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIHRoaXMuI25leHRTdGF0ZS5rZXlzW2UuY29kZV0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICB0aGlzLiNuZXh0U3RhdGUua2V5c1tlLmNvZGVdID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICB0aGlzLiNuZXh0U3RhdGUubW91c2VCdXR0b25zW2UuYnV0dG9uXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy4jbmV4dFN0YXRlLm1vdXNlQnV0dG9uc1tlLmJ1dHRvbl0gPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGJ1dHRvbiBpbiB0aGlzLiNuZXh0U3RhdGUubW91c2VCdXR0b25zKSB7XG4gICAgICAgIHRoaXMuI25leHRTdGF0ZS5tb3VzZUJ1dHRvbnNbYnV0dG9uXSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy4jbmV4dFN0YXRlLm1vdXNlUG9zaXRpb24ueCA9IGUuY2xpZW50WDtcbiAgICAgIHRoaXMuI25leHRTdGF0ZS5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFlcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy4jbmV4dFN0YXRlLm1vdXNlU2Nyb2xsICs9IGUuZGVsdGFZO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnB1dFN0YXRlIHtcbiAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBib29sZWFuPn0gKi9cbiAga2V5cyA9IHt9O1xuICAvKiogQHR5cGUge1JlY29yZDxudW1iZXIsIGJvb2xlYW4+fSAqL1xuICBtb3VzZUJ1dHRvbnMgPSB7fTtcbiAgLyoqIEB0eXBlIHtWZWN0b3IyfSAqL1xuICBtb3VzZVBvc2l0aW9uID0gVmVjdG9yMi56ZXJvO1xuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgbW91c2VTY3JvbGwgPSAwO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0tleWNvZGUgfCBNb3VzZUJ1dHRvbn0gYnV0dG9uXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNQcmVzc2VkKGJ1dHRvbikge1xuICAgIGlmICh0aGlzLmtleXNbYnV0dG9uXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTW91c2VCdXR0b24oYnV0dG9uKSkge1xuICAgICAgY29uc3QgYnV0dG9uTnVtYmVyID0gbW91c2VCdXR0b25Ub0J1dHRvbk51bWJlcihidXR0b24pO1xuICAgICAgcmV0dXJuIHRoaXMubW91c2VCdXR0b25zW2J1dHRvbk51bWJlcl0gPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VmVjdG9yMn0gcHJldlBvc2l0aW9uXG4gICAqL1xuICBnZXRNb3VzZVBvc2l0aW9uRGVsdGEocHJldlBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMubW91c2VQb3NpdGlvbi5jb3B5KCkuc3VidHJhY3QocHJldlBvc2l0aW9uKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2U2Nyb2xsXG4gICAqL1xuICBnZXRNb3VzZVNjcm9sbERlbHRhKHByZXZTY3JvbGwpIHtcbiAgICByZXR1cm4gdGhpcy5tb3VzZVNjcm9sbCAtIHByZXZTY3JvbGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIElucHV0Tm90VXBkYXRlZEVycm9yIGV4dGVuZHMgQ3VzdG9tRXJyb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcIklucHV0IGhhcyBub3QgYmVlbiB1cGRhdGVkIHlldC4gTWFrZSBzdXJlIHRvIGNhbGwgYHVwZGF0ZUlucHV0c2AgYXQgdGhlIGJlZ2lubmluZyBvZiB5b3VyIHVwZGF0ZSBsb29wLlwiKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIn0=`;