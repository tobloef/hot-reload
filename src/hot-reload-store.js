/** @typedef {(meta: Record<string, unknown>) => Promise<void>} HotReloadCallback */
import { assertExhaustive } from "./utils/assert-exhaustive.js";

export class HotReloadStore {
  /** @type {"every" | "some"} */
  acceptMode = "every";

  /**
   * Maps canonical URLs to arrays of callbacks.
   * @type {Record<
   *   string,
   *   Array<{
   *     callback: HotReloadCallback,
   *     meta: Record<string, unknown>
   *   }>
   * >}
   */
  #callbacks = {};

  /**
   * @param {Object} [options]
   * @param {"every" | "some"} [options.acceptMode]
   */
  constructor(options) {
    this.acceptMode = options?.acceptMode ?? this.acceptMode;
  }

  /**
   * @param {string} canonicalUrl
   * @param {HotReloadCallback} callback
   * @param {Record<string, unknown>} [meta]
   */
  subscribe(canonicalUrl, callback, meta) {
    if (this.#callbacks[canonicalUrl] === undefined) {
      this.#callbacks[canonicalUrl] = [];
    }

    this.#callbacks[canonicalUrl] = [
      ...this.#callbacks[canonicalUrl],
      {callback, meta: meta ?? {}},
    ];
  }

  /**
   * @param {string} canonicalUrl
   * @param {HotReloadCallback} callback
   */
  unsubscribe(canonicalUrl, callback) {
    this.#callbacks[canonicalUrl] = this.#callbacks[canonicalUrl]
      ?.filter(({callback: cb}) => cb !== callback);
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

    const promises = callbacks.map(async ({callback, meta}) => callback(meta));

    const results = await Promise.all(promises);

    let wasAccepted = false;
    switch (this.acceptMode) {
      case "every":
        wasAccepted = results.every((result) => result);
        break;
      case "some":
        wasAccepted = results.some((result) => result);
        break;
      default:
        assertExhaustive(this.acceptMode);
    }

    return wasAccepted;
  }
}

export const defaultStore = new HotReloadStore();