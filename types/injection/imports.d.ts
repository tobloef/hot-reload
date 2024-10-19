/**
 * @typedef {Object} ImportInfo
 * @property {string} path
 * @property {string} exportName
 * @property {string} importName
 * @property {string} [attributes]
 */
/**
 * @param {string} code
 * @return ImportInfo[]
 */
export function parseImports(code: string): {
    path: string;
    exportName: string;
    importName: string;
    attributes: string;
}[];
/**
 * @param {string} code
 * @return string
 */
export function commentOutImports(code: string): string;
/**
 * @param {string} path
 * @return {{
 *   isAbsolute: boolean,
 *   isRelative: boolean,
 *   isBare: boolean
 * }}
 */
export function getImportPathInfo(path: string): {
    isAbsolute: boolean;
    isRelative: boolean;
    isBare: boolean;
};
export namespace regexes {
    let pairRegex: RegExp;
    let namedImportsRegex: RegExp;
    let namespaceImportRegex: RegExp;
    let defaultImportRegex: RegExp;
    let importRegex: RegExp;
}
export type ImportInfo = {
    path: string;
    exportName: string;
    importName: string;
    attributes?: string | undefined;
};
export type RegexMatch = {
    start: number;
    end: number;
    matchedText: string;
    namedGroups: Record<string, string>;
    unnamedGroups: string[];
};
