import { describe, it, expect } from "vitest";
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {LayoutEditor} from "../../src/components/LayoutManager/Controller/Worker/LayoutEditor"

describe("LayoutEditor", () => {
  it("initial editor and check ldf file", async () => {
    const ldfPath = resolve(__dirname, "./layouts/default.json")
    const ldfSrc = await readFile(ldfPath, "utf-8");
    const ldf = JSON.parse(ldfSrc);
    const editor = new LayoutEditor(ldf);
    expect(editor.ldf).toBe(ldf);
  });
});