import { commentOutImports, parseImports, getImportPathInfo } from "./imports.js";
import { join } from "../utils/paths.js";

/**
 * @param {string} originalCode
 * @param {string} modulePath
 * @param {string} rootPath
 * @return {Promise<string>}
 */
export async function injectHotImports(originalCode, modulePath, rootPath) {
  const imports = parseImports(originalCode);

  let remainingCode = commentOutImports(originalCode);

  let lets = [];
  let subscribes = [];
  let initialAssigns = new Set();

  for (const importInfo of imports) {
    const {
      path: importPath,
      exportName,
      importName,
      attributes,
    } = importInfo;

    const {
      isBare,
    } = parseImportPath(importPath, modulePath, rootPath);

    if (isBare) {
      continue;
    }

    lets.push(`let ${importName};`);

    const attributesStr = attributes ? `, ${attributes}` : "";

    let assign = `${importName} = newModule`;
    let property = exportName !== "*" ? `["${exportName}"]` : "";
    assign += property;
    assign += ";";

    initialAssigns.add(`${importName} = (await hmr.getModule("${importPath}"))${property};`);

    const subscribe = (
      `hmr.onReload("${importPath}"${attributesStr}, (newModule) => {\n` +
      `\t${assign}\n` +
      `\treturn true;\n` +
      `});`
    );
    subscribes.push(subscribe);
  }

  if (lets.length === 0) {
    return originalCode;
  }

  let addedCode = "////////// START OF INJECTED HOT-RELOAD CODE //////////\n\n";

  addedCode += (
    `${lets.join("\n")}` +
    (lets.length > 0 ? "\n\n" : "") +
    "await (async () => {\n" +
    `\tconst { HotModuleReload } = await import("@tobloef/hot-reload");\n\n` +
    `\tconst hmr = new HotModuleReload(import.meta.url);\n\n` +
    `${subscribes.map((s) => `\t${s}`).join("\n")}` +
    (subscribes.length > 0 ? "\n\n" : "") +
    `${Array.from(initialAssigns).map((t) => `\t${t}`).join("\n")}` +
    (initialAssigns.size > 0 ? "\n" : "") +
    "})();"
  );

  addedCode += "\n\n////////// END OF INJECTED HOT-RELOAD CODE //////////\n\n"

  const generatedCode = addedCode + remainingCode;

  const sourceMap = generateSourceMapForOffset({
    offset: addedCode.split("\n").length - 1,
    originalCode,
    filePath: modulePath,
    rootPath,
  });

  const base64SourceMap = btoa(sourceMap);

  const sourceMapComment = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64SourceMap}`;

  return `${generatedCode}\n${sourceMapComment}`;
}

/**
 * @param {string} importPath
 * @param {string} parentPath
 * @param {string} rootPath
 * @return {{ isBare: boolean, canonicalPath: string }}
 */
function parseImportPath(importPath, parentPath, rootPath) {
  const { isRelative, isBare } = getImportPathInfo(importPath);

  if (!isRelative) {
    return {
      isBare,
      canonicalPath: importPath,
    };
  }

  const parentDir = join(parentPath, "..");

  let canonicalPath = join(parentDir, importPath);

  if (canonicalPath.startsWith(rootPath) && rootPath !== ".") {
    canonicalPath = canonicalPath.slice(rootPath.length);
    if (!canonicalPath.startsWith("./")) {
      canonicalPath = `./${canonicalPath}`;
    }
  }

  return {
    isBare,
    canonicalPath,
  };
}

/**
 * Generates a sourcemap for code that has been offset by a certain amount of lines.
 * For example, the generated code might have 5 extra lines at the top, after which the original code starts.
 * @param {Object} params
 * @param {string} params.originalCode
 * @param {number} params.offset
 * @param {string} params.filePath
 * @param {string} params.rootPath
 * @returns {string}
 */
function generateSourceMapForOffset(params) {
  const {
    originalCode,
    offset,
    filePath,
    rootPath,
  } = params;

  if (offset < 0) {
    throw new Error("Offset must not be negative");
  }

  let mappings = "";

  mappings += ";".repeat(offset);

  const originalLineCount = originalCode.split("\n").length;

  if (originalLineCount > 0) {
    mappings += "AAAA";
  }

  if (originalLineCount > 1) {
    mappings += ";AACA".repeat(originalLineCount - 1);
  }

  const filename = filePath
    .replace(rootPath, "")
    .replace(/\\/g, "/")
    .replace(/^\//, "");

  return JSON.stringify({
    version: 3,
    file: filename,
    sources: [filename],
    sourceRoot: `/${rootPath}`,
    sourcesContent: [originalCode],
    mappings,
  });
}
