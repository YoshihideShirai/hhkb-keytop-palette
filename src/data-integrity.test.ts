import { describe, expect, it } from "vitest";

import { layouts } from "./catalog";
import { presetsByLayout } from "./presets";
import { productAppearances, productSeries } from "./products";
import type { KeyContext, LayoutName } from "./types";

function keyContexts(layoutName: LayoutName): KeyContext[] {
  let index = 0;
  return layouts[layoutName].rows.flatMap((row, rowIndex) =>
    row.map(([label, , className = ""], columnIndex) => ({
      index: index++,
      rowIndex,
      columnIndex,
      rowLength: row.length,
      label,
      className,
    })),
  );
}

describe("keyboard catalog", () => {
  it.each(Object.entries(layouts))("defines valid keys for the %s layout", (_name, layout) => {
    expect(layout.rows).toHaveLength(5);
    expect(layout.rows.flat().length).toBeGreaterThan(0);

    layout.rows.flat().forEach(([, width]) => {
      expect(width).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("product catalog", () => {
  it("uses unique product IDs and represents every series", () => {
    const productIds = productAppearances.map(({ id }) => id);
    expect(new Set(productIds).size).toBe(productIds.length);

    productSeries.forEach((series) => {
      expect(productAppearances.some((product) => product.series === series)).toBe(true);
    });
  });
});

describe("presets", () => {
  it.each(Object.keys(layouts) as LayoutName[])("only produces declared colors for the %s layout", (layoutName) => {
    const contexts = keyContexts(layoutName);

    presetsByLayout[layoutName].forEach((preset) => {
      expect(preset.colors.length).toBeGreaterThan(0);
      contexts.forEach((key) => {
        expect(preset.colors).toContain(preset.make(key));
      });
    });
  });
});
