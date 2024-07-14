export class HotReloadStore {
    /**
     * @param {Object} [options]
     * @param {"every" | "some"} [options.acceptMode]
     */
    constructor(options?: {
        acceptMode?: "every" | "some" | undefined;
    } | undefined);
    /** @type {"every" | "some"} */
    acceptMode: "every" | "some";
    /**
     * @param {string} canonicalUrl
     * @param {HotReloadCallback} callback
     * @param {Record<string, unknown>} [meta]
     */
    subscribe(canonicalUrl: string, callback: HotReloadCallback, meta?: Record<string, unknown> | undefined): void;
    /**
     * @param {string} canonicalUrl
     * @param {HotReloadCallback} callback
     */
    unsubscribe(canonicalUrl: string, callback: HotReloadCallback): void;
    /**
     * @param {string} canonicalUrl
     * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
     */
    trigger(canonicalUrl: string): Promise<boolean>;
    #private;
}
export const defaultStore: HotReloadStore;
export type HotReloadCallback = (meta: Record<string, unknown>) => Promise<void>;
