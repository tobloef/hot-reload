/** @typedef {() => Promise<void>} Callback */

export class CallbackStore {
  /**
   * Maps canonical URLs to arrays of callbacks.
   * @type {Record<string, Callback[]>}
   */
  #callbacks = {};

  /**
   * @param {string} canonicalUrl
   * @param {Callback} callback
   */
  subscribe(canonicalUrl, callback) {
    if (this.#callbacks[canonicalUrl] === undefined) {
      this.#callbacks[canonicalUrl] = [];
    }

    this.#callbacks[canonicalUrl] = [
      ...this.#callbacks[canonicalUrl],
      callback,
    ];
  }

  /**
   * @param {string} canonicalUrl
   * @param {Callback} callback
   */
  unsubscribe(canonicalUrl, callback) {
    this.#callbacks[canonicalUrl] = this.#callbacks[canonicalUrl]?.filter((cb) => cb !== callback);
  }

  /**
   * @param {string} canonicalUrl
   * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
   */
  async trigger(canonicalUrl) {
    const callbacks = this.#callbacks[canonicalUrl];

    if (callbacks === undefined) {
      return false;
    }

    const results = await Promise.all(callbacks.map((cb) => cb()));

    const wasAccepted = results.every((result) => result);

    return wasAccepted;
  }
}
