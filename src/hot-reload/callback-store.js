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
    console.log(this.constructor.name, this.subscribe.name, canonicalUrl);

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
    console.log(this.constructor.name, this.unsubscribe.name, canonicalUrl);

    this.#callbacks[canonicalUrl] = this.#callbacks[canonicalUrl]?.filter((cb) => cb !== callback);
  }

  /**
   * @param {string} canonicalUrl
   * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
   */
  async trigger(canonicalUrl) {
    console.log(this.constructor.name, this.trigger.name, canonicalUrl);

    const callbacks = this.#callbacks[canonicalUrl];

    if (callbacks === undefined) {
      return false;
    }

    const results = await Promise.all(callbacks.map((cb) => cb()));

    const wasAccepted = results.every((result) => result);

    return wasAccepted;
  }
}
