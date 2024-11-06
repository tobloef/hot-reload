/** @typedef {() => Promise<boolean | undefined>} Callback */
export class CallbackStore {
    /**
     * @param {string} key
     * @param {Callback} callback
     */
    subscribe(key: string, callback: Callback): void;
    /**
     * @param {string} key
     * @param {Callback} callback
     */
    unsubscribe(key: string, callback: Callback): void;
    /**
     * @param {string} key
     * @returns {Promise<boolean>} Whether the hot reload was accepted by any of the callbacks.
     */
    trigger(key: string): Promise<boolean>;
    #private;
}
export type Callback = () => Promise<boolean | undefined>;
