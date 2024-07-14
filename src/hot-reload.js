import { defaultStore } from "./hot-reload-store.js";

/** @import { HotReloadStore, HotReloadCallback } from "./hot-reload-store.js"; */

export class HotReload {
  /** @type {string} */
  importUrl;

  /** @type {boolean} */
  logging = false;

  /** @type {HotReloadStore} */
  store;

  /**
   * @param {string} importUrl
   * @param {Object} [options]
   * @param {boolean} [options.logging]
   * @param {HotReloadStore} [options.store]
   */
  constructor(importUrl, options) {
    this.importUrl = importUrl;
    this.logging = options?.logging ?? this.logging;
    this.store = options?.store ?? defaultStore;
  }

  /**
   * @param {string} url
   * @param {HotReloadCallback} callback
   * @param {Record<string, unknown>} [meta]
   */
  subscribe(url, callback, meta) {
    const canonicalUrl = this.getCanonicalUrl(url);

    this.store.subscribe(canonicalUrl, callback, meta);

    if (this.logging) {
      console.debug("Subscribed to hot reload", {
        canonicalUrl,
        relativeUrl: url,
      });
    }
  }

  /**
   * @param {string} url
   * @param {HotReloadCallback} callback
   */
  unsubscribe(url, callback) {
    const canonicalUrl = this.getCanonicalUrl(url);

    this.store.unsubscribe(canonicalUrl, callback);

    if (this.logging) {
      console.debug("Unsubscribed from hot reload", {
        canonicalUrl,
        relativeUrl: url,
      });
    }
  }

  /**
   * @param {string} url
   * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
   */
  async trigger(url) {
    const canonicalUrl = this.getCanonicalUrl(url);

    const wasAccepted = this.store.trigger(canonicalUrl);

    if (this.logging) {
      console.debug("Triggered hot reload", {
        canonicalUrl,
        relativeUrl: url,
        accepted: wasAccepted,
      });
    }

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