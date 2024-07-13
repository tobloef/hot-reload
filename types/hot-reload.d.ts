/** @typedef {(meta: Record<string, unknown>) => Promise<void>} HotReloadCallback */
export class HotReload {
    /**
     * @param {string} importUrl
     * @param {Object} [options]
     * @param {boolean} [options.fullReloadFallback]
     * @param {boolean} [options.logging]
     * @param {"every" | "some"} [options.acceptMode]
     */
    constructor(importUrl: string, options?: {
        fullReloadFallback?: boolean | undefined;
        logging?: boolean | undefined;
        acceptMode?: "every" | "some" | undefined;
    } | undefined);
    /** @type {boolean} */
    fullReloadFallback: boolean;
    /** @type {boolean} */
    logging: boolean;
    /** @type {"every" | "some"} */
    acceptMode: "every" | "some";
    importUrl: string;
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
    #private;
}
export type HotReloadCallback = (meta: Record<string, unknown>) => Promise<void>;
