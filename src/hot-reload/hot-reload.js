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
   * @param {string} key
   * @param {Callback} callback
   * @returns {Unsubscribe}
   */
  onPreReload(key, callback) {
    this.#preReloadCallbackStore.subscribe(key, callback);

    return () => {
      this.#preReloadCallbackStore.unsubscribe(key, callback);
    };
  }

  /**
   * @param {string} key
   * @param {Callback} callback
   * @returns {Unsubscribe}
   */
  onReload(key, callback) {
    this.#reloadCallbackStore.subscribe(key, callback);

    return () => {
      this.#reloadCallbackStore.unsubscribe(key, callback);
    };
  }

  /**
   * @param {string} key
   * @param {Callback} callback
   * @returns {Unsubscribe}
   */
  onPostReload(key, callback) {
    this.#postReloadCallbackStore.subscribe(key, callback);

    return () => {
      this.#postReloadCallbackStore.unsubscribe(key, callback);
    };
  }

  /**
   * @param {string} key
   * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the reload callbacks.
   */
  async reload(key) {
    await this.#preReloadCallbackStore.trigger(key);
    const wasAccepted = await this.#reloadCallbackStore.trigger(key);
    await this.#postReloadCallbackStore.trigger(key);

    return wasAccepted;
  }

  /**
   * @param {string} url
   * @returns {string}
   */
  getAbsoluteUrl(url) {
    return new URL(url, this.importUrl).href;
  }
}