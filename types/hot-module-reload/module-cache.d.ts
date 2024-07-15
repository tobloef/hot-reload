/** @typedef {Object} Module */
/** @typedef {Record<string, string>} Attributes */
export class ModuleCache {
    /**
       * @param {string} url
       * @returns {Promise<Module> | null}
       */
    get(url: string): Promise<Module> | null;
    /**
     * @param {string} url
     * @param {Module | Promise<Module>} module
     */
    set(url: string, module: Module | Promise<Module>): void;
    /**
     * @param {string} url
     */
    remove(url: string): void;
    #private;
}
export type Module = Object;
export type Attributes = Record<string, string>;
