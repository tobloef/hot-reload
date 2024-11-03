import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { injectHotImports } from "../../src/index.js";
import { inputManagerAfterInjection, inputManagerBeforeInjection } from "./real-world-code/input-manager.js";

describe("injectHotImports", () => {
  it("should correctly inject imports in real-world code", () => {
    const originalCode = inputManagerBeforeInjection;
    const modulePath = "input/input-manager.js";
    const rootPath = ".";

    const expected = inputManagerAfterInjection;

    const actual = injectHotImports(
      originalCode,
      modulePath,
      rootPath,
    );

    strictEqual(actual, expected);
  })
});