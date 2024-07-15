import { HotReload } from "../hot-reload/hot-reload.js";
import { ModuleCache } from "./module-cache.js";

/** @import { Callback } from "../hot-reload/callback-store.js"; */

/** @typedef {Object} Module */
/** @typedef {Record<string, string>} Attributes */
/** @typedef {(newModule: Module) => Promise<void>} HotModuleReloadCallback */

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
   * @param {HotModuleReloadCallback} callback
   * @return {void}
   */

  /**
   * @overload
   * @param {string} relativePath
   * @param {Attributes} attributes
   * @param {HotModuleReloadCallback} callback
   * @return {void}
   */

  /**
   * @param {string} relativePath
   * @param {HotModuleReloadCallback | Attributes} attributesOrCallback
   * @param {HotModuleReloadCallback} [callbackOrUndefined]
   * @return {void}
   */
  onReload(relativePath, attributesOrCallback, callbackOrUndefined) {
    console.log(this.constructor.name, this.onReload.name, relativePath);

    const canonicalPath =  this.#hotReload.getCanonicalUrl(relativePath);

    const attributes = typeof attributesOrCallback !== "function"
      ? attributesOrCallback
      : undefined;

    const callback = typeof attributesOrCallback === "function"
      ? attributesOrCallback
      : callbackOrUndefined;

    /** @type {Callback} */
    const wrappedCallback = async () => {
      /** @type {any} */
      const newModule = await this.#importModule(canonicalPath, attributes);

      return callback?.(newModule);
    };

    const bustCache = async () => {
      this.#moduleCache.remove(canonicalPath);
    }

    this.#hotReload.onPreReload(canonicalPath, bustCache);
    this.#hotReload.onReload(relativePath, wrappedCallback);
  }

  /**
   * @param {string} relativePath
   */
  async reload(relativePath) {
    console.log(this.constructor.name, this.reload.name, relativePath);

    return this.#hotReload.reload(relativePath);
  }

  /**
   * @param {string} relativePath
   */
  async getModule(relativePath) {
    console.log(this.constructor.name, this.getModule.name, relativePath);

    const canonicalPath = this.#hotReload.getCanonicalUrl(relativePath);

    return this.#importModule(canonicalPath);
  }

  /**
   * @param {string} canonicalPath
   * @param {Attributes} [attributes]
   * @return {Promise<Module>}
   */
  async #importModule(canonicalPath, attributes) {
    console.log(this.constructor.name, this.#importModule.name, canonicalPath, attributes);

    const cachedModule = this.#moduleCache.get(canonicalPath);

    console.log(`Cache ${cachedModule ? "hit" : "miss"} for ${canonicalPath}`);

    if (cachedModule) {
      return cachedModule;
    }

    const importPromise = new Promise(async (resolve) => {
      const cacheBuster = `?noCache=${Date.now()}`;
      const newModule = await import(
        `${canonicalPath}${cacheBuster}`,
        attributes ? {with: attributes} : undefined,
        );
      resolve(newModule);
    });


    this.#moduleCache.set(canonicalPath, importPromise);

    return importPromise;
  }
}