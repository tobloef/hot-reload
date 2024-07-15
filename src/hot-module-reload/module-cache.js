/** @typedef {Object} Module */
/** @typedef {Record<string, string>} Attributes */

export class ModuleCache {
  /**
   * Maps url+attributes concatenations to promises that resolve to modules.
   * @type {Record<string, Promise<Module>>}
   */
  #moduleCache = {};

/**
   * @param {string} url
   * @returns {Promise<Module> | null}
   */
  get(url) {
    return this.#moduleCache[url] ?? null;
  }

  /**
   * @param {string} url
   * @param {Module | Promise<Module>} module
   */
  set(url, module) {
    this.#moduleCache[url] = Promise.resolve(module);
  }

  /**
   * @param {string} url
   */
  remove(url) {
    delete this.#moduleCache[url];
  }
}
