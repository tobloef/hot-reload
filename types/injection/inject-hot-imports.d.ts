/**
 * @param {string} originalCode
 * @param {string} modulePath
 * @param {string} rootPath
 * @return {Promise<string>}
 */
export function injectHotImports(originalCode: string, modulePath: string, rootPath: string): Promise<string>;
