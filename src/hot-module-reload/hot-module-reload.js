import { HotReload } from "../hot-reload/hot-reload.js";
import { ModuleCache } from "./module-cache.js";

/** @import { Callback } from "../hot-reload/callback-store.js"; */

/** @typedef {Object} Module */
/** @typedef {Record<string, string>} Attributes */
/** @typedef {(newModule: Module) => Promise<boolean>} HotModuleReloadCallback */

const defaultCache = new ModuleCache();

export class HotModuleReload {
  /** @type {HotReload} */
  #hotReload;

  /** @type {ModuleCache} */
  #moduleCache;

  /**
   * @param {string} importUrl
   * @param {Object} [options]
   * @param {ModuleCache} [options.moduleCache]
   * @param {HotReload} [options.hotReload]
   */
  constructor(importUrl, options) {
    this.#moduleCache = options?.moduleCache ?? defaultCache;
    this.#hotReload = options?.hotReload ?? new HotReload(importUrl);
  }

  /**
   * @overload
   * @param {string} relativePath
   * @param {string} canonicalPath
   * @param {HotModuleReloadCallback} callback
   * @return {void}
   */

  /**
   * @overload
   * @param {string} relativePath
   * @param {string} canonicalPath
   * @param {Attributes} attributes
   * @param {HotModuleReloadCallback} callback
   * @return {void}
   */

  /**
   * @param {string} relativePath
   * @param {string} canonicalPath
   * @param {HotModuleReloadCallback | Attributes} attributesOrCallback
   * @param {HotModuleReloadCallback} [callbackOrUndefined]
   * @return {void}
   */
  onReload(relativePath, canonicalPath, attributesOrCallback, callbackOrUndefined) {
    const absoluteUrl = this.#hotReload.getAbsoluteUrl(relativePath);

    const attributes = typeof attributesOrCallback !== "function"
      ? attributesOrCallback
      : undefined;

    const callback = typeof attributesOrCallback === "function"
      ? attributesOrCallback
      : callbackOrUndefined;

    /** @type {Callback} */
    const wrappedCallback = async () => {
      /** @type {any} */
      const newModule = await this.#importModule(absoluteUrl, attributes);

      return callback?.(newModule);
    };

    /** @type {Callback} */
    const bustCache = async () => {
      this.#moduleCache.remove(absoluteUrl);
      return undefined;
    }

    this.#hotReload.onPreReload(canonicalPath, bustCache);
    this.#hotReload.onReload(canonicalPath, wrappedCallback);
  }

  /**
   * @param {string} canonicalPath
   */
  async reload(canonicalPath) {
    return this.#hotReload.reload(canonicalPath);
  }

  /**
   * @param {string} relativePath
   */
  async getModule(relativePath) {
    const absoluteUrl = this.#hotReload.getAbsoluteUrl(relativePath);

    return this.#importModule(absoluteUrl);
  }

  /**
   * @param {string} absoluteUrl
   * @param {Attributes} [attributes]
   * @return {Promise<Module>}
   */
  async #importModule(absoluteUrl, attributes) {
    const cachedModule = this.#moduleCache.get(absoluteUrl);

    if (cachedModule) {
      return cachedModule;
    }

    const importPromise = new Promise(async (resolve) => {
      const cacheBuster = `?noCache=${Date.now()}`;
      const newModule = await import(
        `${absoluteUrl}${cacheBuster}`,
        attributes ? {with: attributes} : undefined,
        );
      resolve(newModule);
    });


    this.#moduleCache.set(absoluteUrl, importPromise);

    return importPromise;
  }
}