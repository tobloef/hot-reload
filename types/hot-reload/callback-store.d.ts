/** @typedef {() => Promise<void>} Callback */
export class CallbackStore {
    /**
     * @param {string} canonicalUrl
     * @param {Callback} callback
     */
    subscribe(canonicalUrl: string, callback: Callback): void;
    /**
     * @param {string} canonicalUrl
     * @param {Callback} callback
     */
    unsubscribe(canonicalUrl: string, callback: Callback): void;
    /**
     * @param {string} canonicalUrl
     * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
     */
    trigger(canonicalUrl: string): Promise<boolean>;
    #private;
}
export type Callback = () => Promise<void>;
