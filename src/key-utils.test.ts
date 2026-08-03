import { describe, expect, it } from "vitest";

import {
  isAlphaKey,
  isHappyHackingKey,
  isJisHeartKey,
  isMarkerKey,
  isNumberKey,
  isUsHeartKey,
  isWhiteProduct,
  isWhiteProductSpecialKey,
  normalizeLabel,
  textColor,
} from "./key-utils";
import type { ProductAppearance } from "./types";

const whiteProduct = { colorName: "白" } as ProductAppearance;
const snowProduct = { colorName: "雪" } as ProductAppearance;

describe("key label helpers", () => {
  it("uses the first line as the normalized key label", () => {
    expect(normalizeLabel("1\n!")).toBe("1");
    expect(normalizeLabel("半角\n/全角")).toBe("半角");
  });

  it("classifies number and alphabet keys", () => {
    expect(isNumberKey("7\n'")).toBe(true);
    expect(isNumberKey("F7")).toBe(false);
    expect(isAlphaKey("A")).toBe(true);
    expect(isAlphaKey("Alt")).toBe(false);
  });

  it("identifies the keys used by named presets", () => {
    expect(isHappyHackingKey("H")).toBe(true);
    expect(isHappyHackingKey("Z")).toBe(false);
    expect(isMarkerKey("Fn", "")).toBe(true);
    expect(isMarkerKey("↑", "arrow")).toBe(true);
    expect(isMarkerKey("A", "")).toBe(false);
  });

  it("keeps US and JIS heart patterns independent", () => {
    expect(isUsHeartKey(0, "9\n(")).toBe(true);
    expect(isUsHeartKey(0, "7\n&")).toBe(false);
    expect(isJisHeartKey(0, "7\n'")).toBe(true);
    expect(isJisHeartKey(0, "9\n)")).toBe(false);
  });
});

describe("appearance helpers", () => {
  it("recognizes white products and their special keys", () => {
    expect(isWhiteProduct(whiteProduct)).toBe(true);
    expect(isWhiteProduct(snowProduct)).toBe(false);
    expect(isWhiteProductSpecialKey("Esc", "")).toBe(true);
    expect(isWhiteProductSpecialKey("", "space")).toBe(true);
    expect(isWhiteProductSpecialKey("A", "")).toBe(false);
  });

  it("selects a readable legend color and handles invalid input", () => {
    expect(textColor("#ffffff")).toBe("#31312e");
    expect(textColor("#000000")).toBe("#f8f6ef");
    expect(textColor("not-a-color")).toBe("#31312e");
  });
});
