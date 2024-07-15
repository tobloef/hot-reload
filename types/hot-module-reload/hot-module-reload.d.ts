export class HotModuleReload {
    /**
     * @param {string} importUrl
     * @param {Object} [options]
     * @param {ModuleCache} [options.moduleCache]
     * @param {HotReload} [options.hotReload]
     */
    constructor(importUrl: string, options?: {
        moduleCache?: ModuleCache | undefined;
        hotReload?: HotReload | undefined;
    } | undefined);
    /**
     * @overload
     * @param {string} relativePath
     * @param {HotModuleReloadCallback} callback
     * @return {void}
     */
    onReload(relativePath: string, callback: HotModuleReloadCallback): void;
    /**
     * @overload
     * @param {string} relativePath
     * @param {Attributes} attributes
     * @param {HotModuleReloadCallback} callback
     * @return {void}
     */
    onReload(relativePath: string, attributes: Attributes, callback: HotModuleReloadCallback): void;
    /**
     * @param {string} relativePath
     */
    reload(relativePath: string): Promise<boolean>;
    /**
     * @param {string} relativePath
     */
    getModule(relativePath: string): Promise<Object>;
    #private;
}
export type Module = Object;
export type Attributes = Record<string, string>;
export type HotModuleReloadCallback = (newModule: Module) => Promise<void>;
import { ModuleCache } from "./module-cache.js";
import { HotReload } from "../hot-reload/hot-reload.js";
