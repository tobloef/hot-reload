/** @import { HotReloadCallback } from "./hot-reload.js"; */
/** @typedef {Object} Module */
/** @typedef {{ [key: string]: string }} Attributes */
/** @typedef {(meta: { attributes: Attributes }) => Promise<void>} HotModuleReloadCallback */
export class HotModuleReload extends HotReload {
    /**
     * @param {string} importUrl
     * @param {Object} [options]
     * @param {boolean} [options.fullReloadFallback]
     * @param {boolean} [options.logging]
     * @param {"every" | "some"} [options.acceptMode]
     * @param {boolean} [options.cache]
     */
    constructor(importUrl: string, options?: {
        fullReloadFallback?: boolean | undefined;
        logging?: boolean | undefined;
        acceptMode?: "every" | "some" | undefined;
        cache?: boolean | undefined;
    } | undefined);
    /** @type {boolean} */
    cache: boolean;
    /**
     * @overload
     * @param {string} relativePath
     * @param {HotModuleReloadCallback} callback1
     * @return {void}
     */
    subscribe(relativePath: string, callback1: HotModuleReloadCallback): void;
    /**
     * @overload
     * @param {string} relativePath
     * @param {Object} attributes
     * @param {HotModuleReloadCallback} callback2
     * @return {void}
     */
    subscribe(relativePath: string, attributes: Object, callback2: HotModuleReloadCallback): void;
    #private;
}
export type Module = Object;
export type Attributes = {
    [key: string]: string;
};
export type HotModuleReloadCallback = (meta: {
    attributes: Attributes;
}) => Promise<void>;
import { HotReload } from "./hot-reload.js";
