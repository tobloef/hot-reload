export class HotReload {
    /**
     * @param {string} importUrl
     * @param {Object} [options]
     * @param {{
     *   preReload?: CallbackStore,
     *   reload?: CallbackStore,
     *   postReload?: CallbackStore,
     * }} [options.callbackStore]
     */
    constructor(importUrl: string, options?: {
        callbackStore?: {
            preReload?: CallbackStore;
            reload?: CallbackStore;
            postReload?: CallbackStore;
        } | undefined;
    } | undefined);
    /** @type {string} */
    importUrl: string;
    /**
     * @param {string} url
     * @param {Callback} callback
     * @returns {Unsubscribe}
     */
    onPreReload(url: string, callback: Callback): Unsubscribe;
    /**
     * @param {string} url
     * @param {Callback} callback
     * @returns {Unsubscribe}
     */
    onReload(url: string, callback: Callback): Unsubscribe;
    /**
     * @param {string} url
     * @param {Callback} callback
     * @returns {Unsubscribe}
     */
    onPostReload(url: string, callback: Callback): Unsubscribe;
    /**
     * @param {string} url
     * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the reload callbacks.
     */
    reload(url: string): Promise<boolean>;
    /**
     * @param {string} url
     * @returns {string}
     */
    getCanonicalUrl(url: string): string;
    #private;
}
export type Unsubscribe = () => void;
import type { Callback } from "./callback-store.js";
import { CallbackStore } from "./callback-store.js";
