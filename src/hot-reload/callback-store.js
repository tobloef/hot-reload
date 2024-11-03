/** @typedef {() => Promise<void>} Callback */

export class CallbackStore {
  /**
   * Maps keys to arrays of callbacks.
   * @type {Record<string, Callback[]>}
   */
  #callbacks = {};

  /**
   * @param {string} key
   * @param {Callback} callback
   */
  subscribe(key, callback) {
    if (this.#callbacks[key] === undefined) {
      this.#callbacks[key] = [];
    }

    this.#callbacks[key] = [
      ...this.#callbacks[key],
      callback,
    ];
  }

  /**
   * @param {string} key
   * @param {Callback} callback
   */
  unsubscribe(key, callback) {
    this.#callbacks[key] = this.#callbacks[key]?.filter((cb) => cb !== callback);
  }

  /**
   * @param {string} key
   * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
   */
  async trigger(key) {
    const callbacks = this.#callbacks[key];

    if (callbacks === undefined) {
      return false;
    }

    const results = await Promise.all(callbacks.map((cb) => cb()));

    const wasAccepted = results.every((result) => result);

    return wasAccepted;
  }
}
