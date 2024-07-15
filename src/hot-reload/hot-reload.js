import { CallbackStore } from "./callback-store.js";

/** @import { Callback } from "./callback-store.js"; */

/** @typedef {() => void} Unsubscribe */

const defaultPreReloadCallbackStore = new CallbackStore();
const defaultReloadCallbackStore = new CallbackStore();
const defaultPostReloadCallbackStore = new CallbackStore();


export class HotReload {
  /** @type {string} */
  importUrl;

  /** @type {CallbackStore} */
  #preReloadCallbackStore;

  /** @type {CallbackStore} */
  #reloadCallbackStore;

  /** @type {CallbackStore} */
  #postReloadCallbackStore;

  /**
   * @param {string} importUrl
   * @param {Object} [options]
   * @param {{
   *   preReload?: CallbackStore,
   *   reload?: CallbackStore,
   *   postReload?: CallbackStore,
   * }} [options.callbackStore]
   */
  constructor(importUrl, options) {
    this.importUrl = importUrl;
    this.#preReloadCallbackStore = options?.callbackStore?.preReload ?? defaultPreReloadCallbackStore;
    this.#reloadCallbackStore = options?.callbackStore?.reload ?? defaultReloadCallbackStore;
    this.#postReloadCallbackStore = options?.callbackStore?.postReload ?? defaultPostReloadCallbackStore;
  }

  /**
   * @param {string} url
   * @param {Callback} callback
   * @returns {Unsubscribe}
   */
  onPreReload(url, callback) {
    const canonicalUrl = this.getCanonicalUrl(url);

    this.#preReloadCallbackStore.subscribe(canonicalUrl, callback);

    return () => {
      this.#preReloadCallbackStore.unsubscribe(canonicalUrl, callback);
    };
  }

  /**
   * @param {string} url
   * @param {Callback} callback
   * @returns {Unsubscribe}
   */
  onReload(url, callback) {
    const canonicalUrl = this.getCanonicalUrl(url);

    this.#reloadCallbackStore.subscribe(canonicalUrl, callback);

    return () => {
      this.#reloadCallbackStore.unsubscribe(canonicalUrl, callback);
    };
  }

  /**
   * @param {string} url
   * @param {Callback} callback
   * @returns {Unsubscribe}
   */
  onPostReload(url, callback) {
    const canonicalUrl = this.getCanonicalUrl(url);

    this.#postReloadCallbackStore.subscribe(canonicalUrl, callback);

    return () => {
      this.#postReloadCallbackStore.unsubscribe(canonicalUrl, callback);
    };
  }

  /**
   * @param {string} url
   * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the reload callbacks.
   */
  async reload(url) {
    const canonicalUrl = this.getCanonicalUrl(url);

    await this.#preReloadCallbackStore.trigger(canonicalUrl);
    const wasAccepted = await this.#reloadCallbackStore.trigger(canonicalUrl);
    await this.#postReloadCallbackStore.trigger(canonicalUrl);

    return wasAccepted;
  }

  /**
   * @param {string} url
   * @returns {string}
   */
  getCanonicalUrl(url) {
    return new URL(url, this.importUrl).href;
  }
}