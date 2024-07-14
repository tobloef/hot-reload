/** @import { HotReloadCallback } from "./hot-reload-store.js"; */
/** @typedef {Object} Module */
/** @typedef {{ [key: string]: string }} Attributes */
/** @typedef {(newModule: Module) => Promise<void>} HotModuleReloadCallback */
export class HotModuleReload {
    /**
     * @param {string} importUrl
     * @param {Object} [options]
     * @param {boolean} [options.logging]
     * @param {"every" | "some"} [options.acceptMode]
     * @param {boolean} [options.cache]
     */
    constructor(importUrl: string, options?: {
        logging?: boolean | undefined;
        acceptMode?: "every" | "some" | undefined;
        cache?: boolean | undefined;
    } | undefined);
    /** @type {boolean} */
    cache: boolean;
    /**
     * @overload
     * @param {string} relativePath
     * @param {HotModuleReloadCallback} callback
     * @return {void}
     */
    subscribe(relativePath: string, callback: HotModuleReloadCallback): void;
    /**
     * @overload
     * @param {string} relativePath
     * @param {Object} attributes
     * @param {HotModuleReloadCallback} callback
     * @return {void}
     */
    subscribe(relativePath: string, attributes: Object, callback: HotModuleReloadCallback): void;
    /**
     * @param {string} relativePath
     */
    trigger(relativePath: string): Promise<boolean>;
    #private;
}
export type Module = Object;
export type Attributes = {
    [key: string]: string;
};
export type HotModuleReloadCallback = (newModule: Module) => Promise<void>;
