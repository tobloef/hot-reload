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
     * @param {string} key
     * @param {Callback} callback
     * @returns {Unsubscribe}
     */
    onPreReload(key: string, callback: Callback): Unsubscribe;
    /**
     * @param {string} key
     * @param {Callback} callback
     * @returns {Unsubscribe}
     */
    onReload(key: string, callback: Callback): Unsubscribe;
    /**
     * @param {string} key
     * @param {Callback} callback
     * @returns {Unsubscribe}
     */
    onPostReload(key: string, callback: Callback): Unsubscribe;
    /**
     * @param {string} key
     * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the reload callbacks.
     */
    reload(key: string): Promise<boolean>;
    /**
     * @param {string} url
     * @returns {string}
     */
    getAbsoluteUrl(url: string): string;
    #private;
}
export type Unsubscribe = () => void;
import type { Callback } from "./callback-store.js";
import { CallbackStore } from "./callback-store.js";
