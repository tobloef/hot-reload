/** @import { HotReloadStore, HotReloadCallback } from "./hot-reload-store.js"; */
export class HotReload {
    /**
     * @param {string} importUrl
     * @param {Object} [options]
     * @param {boolean} [options.logging]
     * @param {HotReloadStore} [options.store]
     */
    constructor(importUrl: string, options?: {
        logging?: boolean | undefined;
        store?: HotReloadStore | undefined;
    } | undefined);
    /** @type {string} */
    importUrl: string;
    /** @type {boolean} */
    logging: boolean;
    /** @type {HotReloadStore} */
    store: HotReloadStore;
    /**
     * @param {string} url
     * @param {HotReloadCallback} callback
     * @param {Record<string, unknown>} [meta]
     */
    subscribe(url: string, callback: HotReloadCallback, meta?: Record<string, unknown> | undefined): void;
    /**
     * @param {string} url
     * @param {HotReloadCallback} callback
     */
    unsubscribe(url: string, callback: HotReloadCallback): void;
    /**
     * @param {string} url
     * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
     */
    trigger(url: string): Promise<boolean>;
    /**
     * @param {string} url
     * @returns {string}
     */
    getCanonicalUrl(url: string): string;
}
import type { HotReloadStore } from "./hot-reload-store.js";
import type { HotReloadCallback } from "./hot-reload-store.js";
